---
name: maimemo-study
description: 用户要查询墨墨今日学习进度、今日单词、学习记录、规划复习、添加单词或提前复习时使用；学习 API 属于公测。
---

# 墨墨学习复盘

1. 查询进度使用 get_study_progress，今日单词使用 get_today_items，记录使用 query_study_records。这些工具是只读，即使 HTTP 方法为 POST。
2. 学习接口处于公测。用户需要在 App 开启自动同步，当天打开 App 初始化。数据为空或报错时说明原始状态，不能编造背词数量，也不能把未初始化的总数视为可靠数据。
3. 查询日期用北京时间 +08:00，明确查询范围。一次列表默认最多 50 条、上限 1000；未获取全部时必须标注是样本。统计优先用 as_count=true。
4. voc_ids 与 spellings 互斥，按实际需求选一种。复盘结合已完成/未完成、新学/复习，只依据 API 实际返回字段。
5. 加词：先查询 spelling 对应真实 ID，再用 add_words（body.words 数组含 id，body.advance 默认 false）。需用户明确授权具体单词，confirm=true。报告 added_count，不假设全部加入；重复词和容量上限会影响数量。
6. 提前复习：advance_study 要求用户授权，body.voc_ids 必填。官方说明需达到 10 级解锁，实际权限以返回结果为准。不要擅自调整复习计划。
7. 生成学习建议、例句和自测题可在聊天中完成，但生成内容不等于已保存到墨墨。用户明确要求保存时再调用写工具。
8. 不读取 token 文件，不显示凭证。遇到 401/403/429 分别提示检查 token、权限和频控；写入失败先查结果再考虑重试。

优先使用已安装的 MCP 工具，不用浏览器模拟登录。云词本操作参考另一个 skill maimemo-vocabulary。
