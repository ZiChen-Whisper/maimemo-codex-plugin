import test from 'node:test';
import assert from 'node:assert/strict';
import { MemoClient, catalog } from '../server/client.mjs';
const options = { token: 'private-test-token', interval: 0, sleep: async () => {} };
const ok = data => new Response(JSON.stringify(data), { status: 200 });
test('all 24 tools compile and POST queries are read only', () => {
  assert.equal(catalog.tools.length, 24);
  for (const name of ['get_study_progress', 'get_today_items', 'query_study_records', 'list_vocabulary']) {
    assert.equal(catalog.tools.find(t => t.name === 'maimemo_' + name).annotations.readOnlyHint, true);
  }
});
test('GET query and bearer header', async () => {
  const c = new MemoClient({ ...options, fetchImpl: async (url, init) => {
    assert.equal(url.href, 'https://open.maimemo.com/open/api/v1/memo/vocabulary?spelling=apple');
    assert.equal(init.headers.Authorization, 'Bearer private-test-token');
    assert.equal(init.body, undefined);
    assert.equal(init.redirect, 'error');
    return ok({ voc: { id: '123' } });
  }});
  assert.deepEqual(await c.call('maimemo_get_vocabulary', { spelling: 'apple' }), { voc: { id: '123' } });
});
test('query arrays follow OpenAPI explode default', async () => {
  const c = new MemoClient({ ...options, fetchImpl: async url => {
    assert.deepEqual(url.searchParams.getAll('ids'), ['a', 'b']); return ok({ notepads: [] });
  }});
  await c.call('maimemo_list_notepads', { ids: ['a', 'b'] });
});
test('write requires explicit confirmation before network access', async () => {
  let calls = 0;
  const c = new MemoClient({ ...options, fetchImpl: async () => { calls++; return ok({}); }});
  await assert.rejects(c.call('maimemo_delete_notepad', { id: 'a' }), /Invalid/);
  await assert.rejects(c.call('maimemo_delete_notepad', { id: 'a', confirm: false }), /Invalid/);
  assert.equal(calls, 0);
});
test('path substitution and mutation JSON omit confirm', async () => {
  const c = new MemoClient({ ...options, fetchImpl: async (url, init) => {
    assert.equal(url.pathname, '/open/api/v1/memo/notepads/a%2Fb');
    assert.equal(init.method, 'DELETE'); assert.equal(init.body, undefined); return ok({});
  }});
  await c.call('maimemo_delete_notepad', { id: 'a/b', confirm: true });
});
test('POST read body stays nested and is forwarded correctly', async () => {
  const c = new MemoClient({ ...options, fetchImpl: async (_url, init) => {
    assert.equal(init.body, '{"spellings":["apple"]}'); return ok({ vocs: [] });
  }});
  await c.call('maimemo_list_vocabulary', { body: { spellings: ['apple'] } });
});
test('type errors, unknown keys, mutually exclusive and size limits rejected locally', async () => {
  const c = new MemoClient({ ...options, fetchImpl: async () => { throw new Error('Must not fetch'); }});
  for (const args of [{ body: { limit: '50' } }, { body: { limit: 1001 } }, { body: { extra: true } }, { body: { spellings: ['apple'], voc_ids: ['a'] } }]) {
    await assert.rejects(c.call('maimemo_get_today_items', args));
  }
  await assert.rejects(c.call('maimemo_get_vocabulary', { spelling: 'apple', token: 'x' }));
});
test('credential reflections are redacted and HTTP error body is never exposed', async () => {
  const c = new MemoClient({ ...options, fetchImpl: async () => ok({ reflected: options.token }) });
  assert.equal((await c.call('maimemo_get_study_progress')).reflected, '[REDACTED]');
  const e = new MemoClient({ ...options, fetchImpl: async () => new Response(options.token, { status: 401 }) });
  await assert.rejects(e.call('maimemo_get_study_progress'), error => error.message.includes('401') && !error.message.includes(options.token));
});
test('429 and ambiguous write failures never retry', async () => {
  let calls = 0;
  const c = new MemoClient({ ...options, fetchImpl: async () => { calls++; return new Response('', { status: 429 }); }});
  await assert.rejects(c.call('maimemo_delete_notepad', { id: 'a', confirm: true }), /429/);
  assert.equal(calls, 1);
  c.fetchImpl = async () => { calls++; throw new Error(options.token); };
  await assert.rejects(c.call('maimemo_delete_notepad', { id: 'a', confirm: true }), error => !error.message.includes(options.token));
  assert.equal(calls, 2);
});
test('missing credentials and business errors are surfaced', async () => {
  const c = new MemoClient({ ...options, token: '' });
  await assert.rejects(c.call('maimemo_get_study_progress'), /MAIMEMO_TOKEN/);
  const b = new MemoClient({ ...options, fetchImpl: async () => ok({ success: false }) });
  await assert.rejects(b.call('maimemo_get_study_progress'), /业务错误/);
});
test('requests are serialized', async () => {
  let concurrent = 0, max = 0;
  const c = new MemoClient({ ...options, fetchImpl: async () => {
    max = Math.max(max, ++concurrent); await new Promise(r => setTimeout(r, 10)); concurrent--; return ok({});
  }});
  await Promise.all([c.call('maimemo_get_study_progress'), c.call('maimemo_get_study_progress')]);
  assert.equal(max, 1);
});
