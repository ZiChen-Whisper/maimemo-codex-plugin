import { build } from 'esbuild';
import { mkdir, copyFile, readFile, readdir, writeFile } from 'node:fs/promises';
import { dirname, resolve, basename } from 'node:path';
await mkdir('server/dist', { recursive: true });
const result = await build({ entryPoints: ['server/index.mjs'], outfile: 'server/dist/index.mjs', bundle: true, metafile: true,
  platform: 'node', target: 'node22', format: 'esm', minify: true,
  banner: { js: "import { createRequire as __createRequire } from 'node:module'; const require = __createRequire(import.meta.url);" } });
await copyFile('server/catalog.json', 'server/dist/catalog.json');
const packages = new Map();
for (const input of Object.keys(result.metafile.inputs).filter(p => p.includes('node_modules/'))) {
  let dir = dirname(resolve(input));
  while (basename(dir) !== 'node_modules' && dirname(dir) !== dir) {
    try {
      const pkg = JSON.parse(await readFile(resolve(dir, 'package.json'), 'utf8'));
      if (pkg.name) { packages.set(pkg.name, { dir, pkg }); break; }
    } catch {}
    dir = dirname(dir);
  }
}
const notices = ['# Bundled dependency notices', '', 'Project code is MIT; the following dependencies retain their own licenses.', ''];
for (const [name, { dir, pkg }] of [...packages].sort((a,b) => a[0].localeCompare(b[0]))) {
  notices.push(`## ${name} ${pkg.version}`, '', `Declared license: ${pkg.license || 'see below'}`, '');
  const files = (await readdir(dir)).filter(f => /^(license|copying|notice)/i.test(f));
  if (!files.length) throw new Error('Missing dependency license: ' + name);
  for (const file of files) notices.push('```text', (await readFile(resolve(dir,file),'utf8')).trim(), '```', '');
}
await writeFile('server/dist/THIRD_PARTY_NOTICES.md', notices.join('\n'));
console.log('Built portable server/dist/index.mjs');
