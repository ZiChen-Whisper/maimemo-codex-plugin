import { execFileSync } from 'node:child_process';
import { loadToken } from '../server/client.mjs';
const files = execFileSync('git', ['ls-files', '-z'], { encoding: 'utf8' }).split('\0').filter(Boolean);
const token = loadToken();
for (const path of files) {
  if (/(^|\/)(node_modules|reference|\.env|token)(\/|$)/.test(path)) throw new Error('Private/dependency file tracked: ' + path);
  const content = execFileSync('git', ['show', ':' + path], { maxBuffer: 10 * 1024 * 1024 }).toString();
  if (token && content.includes(token)) throw new Error('Credential detected in tracked file: ' + path);
}
console.log(`Checked ${files.length} staged files: no configured token or private/dependency files.`);
