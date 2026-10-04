import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import { MemoClient, catalog, loadToken } from './client.mjs';

const client = new MemoClient();
const server = new Server({ name: 'maimemo-codex-plugin', version: '0.1.2' }, { capabilities: { tools: {} } });
const statusTool = { name: 'maimemo_connection_status', description: '检查本地 token 是否配置（不显示 token，也不验证远端有效性）。',
  inputSchema: { type: 'object', properties: {}, additionalProperties: false }, annotations: { readOnlyHint: true, openWorldHint: false } };
server.setRequestHandler(ListToolsRequestSchema, async () => ({ tools: [statusTool, ...catalog.tools.map(({ name, description, inputSchema, annotations }) => ({ name, description, inputSchema, annotations }))] }));
server.setRequestHandler(CallToolRequestSchema, async request => {
  try {
    const data = request.params.name === statusTool.name ? { configured: Boolean(loadToken()), apiVerified: false } : await client.call(request.params.name, request.params.arguments || {});
    return { content: [{ type: 'text', text: JSON.stringify(data) }] };
  } catch (error) {
    return { isError: true, content: [{ type: 'text', text: error.message }] };
  }
});
await server.connect(new StdioServerTransport());
