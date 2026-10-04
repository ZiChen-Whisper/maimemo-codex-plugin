import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import { fileURLToPath } from 'node:url';
const client = new Client({ name: 'maimemo-smoke', version: '0.1.0' });
try {
  const entry = process.env.MAIMEMO_SERVER_PATH || fileURLToPath(new URL('../server/dist/index.mjs', import.meta.url));
  await client.connect(new StdioClientTransport({ command: process.execPath, args: [entry] }));
  const tools = await client.listTools();
  console.log('Discovered tools:', tools.tools.length);
  const result = await client.callTool({ name: 'maimemo_connection_status', arguments: {} });
  console.log('Local configuration:', result.content[0].text);
  if (process.argv.includes('--live')) {
    for (const [name, args] of [['maimemo_get_vocabulary', { spelling: 'apple' }], ['maimemo_list_notepads', { limit: 1, offset: 0 }], ['maimemo_get_study_progress', {}]]) {
      const r = await client.callTool({ name, arguments: args });
      // Report shape only: no private notebook content or learning values.
      console.log(name, r.isError ? r.content[0].text : 'OK; response keys=' + Object.keys(JSON.parse(r.content[0].text)).join(','));
      if (r.isError) process.exitCode = 1;
    }
  }
} finally { await client.close(); }
