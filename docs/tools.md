# 工具列表

来源：用户提供的官方 OpenAPI YML（2026-10-04）。只覆盖墨墨背单词 /memo/，不包含 Markji。

| 工具 | 功能 | 是否只读 | HTTP |
| --- | --- | --- | --- |
| `maimemo_list_interpretations` | 获取释义 | 是 | GET |
| `maimemo_create_interpretation` | 创建释义 | 否 | POST |
| `maimemo_update_interpretation` | 更新释义 | 否 | POST |
| `maimemo_delete_interpretation` | 删除释义 | 否 | DELETE |
| `maimemo_list_notes` | 获取助记 | 是 | GET |
| `maimemo_create_note` | 创建助记 | 否 | POST |
| `maimemo_update_note` | 更新助记 | 否 | POST |
| `maimemo_delete_note` | 删除助记 | 否 | DELETE |
| `maimemo_list_notepads` | 查询云词本 | 是 | GET |
| `maimemo_create_notepad` | 创建云词本 | 否 | POST |
| `maimemo_get_notepad` | 获取云词本 | 是 | GET |
| `maimemo_update_notepad` | 更新云词本 | 否 | POST |
| `maimemo_delete_notepad` | 删除云词本 | 否 | DELETE |
| `maimemo_list_phrases` | 获取例句 | 是 | GET |
| `maimemo_create_phrase` | 创建例句 | 否 | POST |
| `maimemo_update_phrase` | 更新例句 | 否 | POST |
| `maimemo_delete_phrase` | 删除例句 | 否 | DELETE |
| `maimemo_get_study_progress` | 获取今日学习进度（公测） | 是 | POST |
| `maimemo_get_today_items` | 获取今日学习单词（公测） | 是 | POST |
| `maimemo_query_study_records` | 查询学习记录（公测） | 是 | POST |
| `maimemo_add_words` | 添加单词（公测） | 否 | POST |
| `maimemo_advance_study` | 提前复习（公测） | 否 | POST |
| `maimemo_get_vocabulary` | 获取单词 | 是 | GET |
| `maimemo_list_vocabulary` | 查询单词 | 是 | POST |

另有 `maimemo_connection_status`，只检查本地 token 是否配置。

## 参数约定

- 查询参数和路径 ID 直接放在工具参数对象内。
- 有 JSON 请求体的接口使用 body 字段，结构来自官方 YML。
- 写操作另需 confirm=true，不会发送给墨墨 API。
- 未列出的字段、错误类型、超过文档限制的数组在本地拒绝。
- POST 方法不一定是写操作；进度、今日单词、学习记录及批量查词都是只读。

## 调用示例

```json
{"name":"maimemo_get_vocabulary","arguments":{"spelling":"apple"}}
```

```json
{"name":"maimemo_list_vocabulary","arguments":{"body":{"spellings":["apple","resilient"]}}}
```

```json
{"name":"maimemo_list_notepads","arguments":{"limit":10,"offset":0}}
```

```json
{
  "name": "maimemo_create_notepad",
  "arguments": {
    "confirm": true,
    "body": {
      "notepad": {
        "status": "UNPUBLISHED",
        "title": "阅读生词",
        "brief": "阅读笔记",
        "content": "resilient\nsustain",
        "tags": [
          "六级"
        ]
      }
    }
  }
}
```

这里的 JSON 是工具参数示例。在 Codex 对话里用自然语言描述需求即可。
