import { writeFile, mkdir } from 'node:fs/promises';
import { catalog } from '../server/client.mjs';
const lines = ['# 工具列表', '', '来源：用户提供的官方 OpenAPI YML（2026-10-04）。只覆盖墨墨背单词 /memo/，不包含 Markji。', '',
  '| 工具 | 功能 | 是否只读 | HTTP |', '| --- | --- | --- | --- |',
  ...catalog.tools.map(t => `| \`${t.name}\` | ${t.description.split('\n')[0]} | ${t.annotations.readOnlyHint ? '是' : '否'} | ${t.method} |`),
  '', '另有 `maimemo_connection_status`，只检查本地 token 是否配置。', '', '## 参数约定', '',
  '- 查询参数和路径 ID 直接放在工具参数对象内。',
  '- 有 JSON 请求体的接口使用 body 字段，结构来自官方 YML。',
  '- 写操作另需 confirm=true，不会发送给墨墨 API。',
  '- 未列出的字段、错误类型、超过文档限制的数组在本地拒绝。',
  '- POST 方法不一定是写操作；进度、今日单词、学习记录及批量查词都是只读。', '', '## 调用示例', '',
  '```json', '{"name":"maimemo_get_vocabulary","arguments":{"spelling":"apple"}}', '```', '',
  '```json', '{"name":"maimemo_list_vocabulary","arguments":{"body":{"spellings":["apple","resilient"]}}}', '```', '',
  '```json', '{"name":"maimemo_list_notepads","arguments":{"limit":10,"offset":0}}', '```', '',
  '```json', JSON.stringify({name:'maimemo_create_notepad',arguments:{confirm:true,body:{notepad:{status:'UNPUBLISHED',title:'阅读生词',brief:'阅读笔记',content:'resilient\nsustain',tags:['六级']}}}},null,2), '```',
  '', '这里的 JSON 是工具参数示例。在 Codex 对话里用自然语言描述需求即可。'];
await mkdir('docs', { recursive: true });
await writeFile('docs/tools.md', lines.join('\n') + '\n');
