import { readFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';
import Ajv from 'ajv';

export const catalog = JSON.parse(readFileSync(new URL('./catalog.json', import.meta.url), 'utf8'));
export const credentialPath = join(homedir(), '.config', 'maimemo-plugin', 'token');
export function loadToken() {
  const env = process.env.MAIMEMO_TOKEN?.trim();
  if (env) return env;
  try { return readFileSync(credentialPath, 'utf8').trim(); } catch { return ''; }
}
const ajv = new Ajv({ strict: false, allErrors: true });
const validators = new Map(catalog.tools.map(t => [t.name, ajv.compile(t.inputSchema)]));
const defaultSleep = ms => new Promise(resolve => setTimeout(resolve, ms));

// Per-process serial queue: at most 1 call / 2 seconds, below documented short windows.
// Multiple independent clients share the account quota; no automatic mutation retries.
export class MemoClient {
  constructor({ token = loadToken(), fetchImpl = fetch, sleep = defaultSleep, interval = 2000 } = {}) {
    this.token = token;
    this.fetchImpl = fetchImpl;
    this.sleep = sleep;
    this.interval = interval;
    this.next = 0;
    this.queue = Promise.resolve();
  }
  call(name, args = {}) {
    const task = this.queue.then(() => this.execute(name, args));
    this.queue = task.catch(() => {});
    return task;
  }
  async execute(name, args) {
    const tool = catalog.tools.find(t => t.name === name);
    if (!tool) throw new Error('Unknown tool');
    const validate = validators.get(name);
    if (!validate(args)) throw new Error('Invalid arguments: ' + JSON.stringify(validate.errors.map(e => ({ path: e.instancePath, rule: e.keyword }))));
    if (args.body?.voc_ids && args.body?.spellings) throw new Error('voc_ids and spellings cannot both be supplied');
    if (!this.token || /[\r\n]/.test(this.token)) throw new Error('MAIMEMO_TOKEN 未配置或格式错误；请运行 scripts/configure.ps1 或设置环境变量。');
    let path = tool.route;
    const url = new URL('https://open.maimemo.com/open' + path);
    for (const p of tool.parameters) {
      if (args[p.name] === undefined) continue;
      if (p.in === 'path') path = path.replace('{' + p.name + '}', encodeURIComponent(args[p.name]));
      if (p.in === 'query') {
        const values = Array.isArray(args[p.name]) ? args[p.name] : [args[p.name]];
        // OpenAPI default query arrays: form + explode=true.
        for (const v of values) url.searchParams.append(p.name, String(v));
      }
    }
    url.pathname = new URL('https://open.maimemo.com/open' + path).pathname;
    if (path.includes('{')) throw new Error('Missing path parameter');
    await this.sleep(Math.max(0, this.next - Date.now()));
    this.next = Date.now() + this.interval;
    let response;
    try {
      response = await this.fetchImpl(url, { method: tool.method, redirect: 'error',
        headers: { Authorization: 'Bearer ' + this.token, Accept: 'application/json', 'Content-Type': 'application/json' },
        ...(tool.hasBody ? { body: JSON.stringify(args.body) } : {}), signal: AbortSignal.timeout(30000) });
    } catch { throw new Error('网络请求失败或超时；写操作请先查询结果，再决定是否重试。'); }
    if (!response.ok) {
      const hint = { 401: 'token 无效或已过期', 403: '账号无权限或接口受限', 429: '触发墨墨频控，请稍后再试' }[response.status] || '请求未成功';
      throw new Error(`墨墨 API HTTP ${response.status}: ${hint}。`);
    }
    let data;
    try { data = await response.json(); } catch { throw new Error('墨墨 API 返回了非 JSON 数据'); }
    if (data.success === false || data.error) throw new Error('墨墨 API 返回业务错误；请检查参数、账号权限和 App 同步状态。');
    // Never echo credentials, including an accidental upstream reflection.
    return JSON.parse(JSON.stringify(data).split(this.token).join('[REDACTED]'));
  }
}
