import { readFileSync, existsSync, readdirSync } from 'node:fs';
import assert from 'node:assert/strict';
const json = path => JSON.parse(readFileSync(path, 'utf8'));
const portable = json('plugin.json'), codex = json('.codex-plugin/plugin.json');
assert.equal(portable.name, codex.name);
assert.equal(portable.version, codex.version);
assert(portable.extensions['com.openai'].interface.shortDescription.length <= 30);
assert.equal(portable.extensions['com.openai'].interface.displayName, codex.interface.displayName);
for (const path of ['server/dist/index.mjs', 'server/dist/catalog.json', 'server/dist/THIRD_PARTY_NOTICES.md', 'LICENSE', '.mcp.json', 'mcp.json']) assert(existsSync(path), path);
assert.deepEqual(json('server/catalog.json'), json('server/dist/catalog.json'));
for (const dir of readdirSync('skills')) {
  const text = readFileSync(`skills/${dir}/SKILL.md`, 'utf8');
  assert(text.startsWith('---\n'));
  assert(text.includes(`name: ${dir}\n`));
  assert(text.includes('\ndescription: '));
}
assert.equal(json('.agents/plugins/marketplace.json').plugins[0].name, portable.name);
assert.equal(json('.agents/plugins/marketplace.json').plugins[0].source.path, '.');
console.log('Plugin manifests, skills, runtime and catalog consistency passed.');
