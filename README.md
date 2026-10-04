<p align="center"><img src="assets/readme/hero.svg" width="100%" alt="MaiMemo：在 ChatGPT 桌面版中查词、整理云词本和复盘学习。token 保留在本机。"></p>

# maimemo-codex-plugin

在 **ChatGPT 桌面版（原 Codex 桌面版）**中，用自然语言连接墨墨背单词：把阅读生词整理成云词本、查看今天还没背完的词、根据真实学习数据做自测。**非官方开源插件**，使用[墨墨官方开放 API](https://open.maimemo.com/)。

安装好后，新开一个本地 chat，复制这句话开始：

```text
使用 maimemo-codex-plugin 检查墨墨连接，再查询 resilient 是否被墨墨词库收录。
如果查到释义和例句，请展示；查不到时不要编造。只读取，不修改数据。
```

包含 **24 个 API 工具 + 1 个本地配置检查工具、2 个 skill**。本文先介绍桌面安装和使用；CLI、开发与工具参数放在后面。

## 适用范围

| 项目 | 当前情况 |
| --- | --- |
| ChatGPT 桌面版 | 主要入口；本地 Codex chat / 可以执行本地工具的工作环境 |
| 已验证系统 | Windows；安装、MCP 启动与三个真实读取接口已验证 |
| 运行依赖 | Node.js 22 或更高版本；添加 GitHub 插件源还需要可用的 Git |
| 墨墨账号 | 自己的开放 API token，与 ChatGPT 登录是两回事 |
| 网页、手机端 | 本项目是本地 stdio MCP，不能直接在这些环境运行 |
| macOS、Linux、其他 MCP 客户端 | 尚未实机验证；便携配置在 mcp.json |

“让 ChatGPT 安装”需要能访问本机文件、执行命令的本地 chat。普通网页聊天不能代办本机安装。桌面某些入口仍显示 Codex，CLI 命令仍叫 `codex`，仓库名中的 codex 也继续保留。

## ChatGPT 桌面版怎么安装

### 推荐：复制这段话，让 ChatGPT 帮你安装

在桌面版打开一个本地 Codex chat，选择一个本地文件夹，把下面整段发给 ChatGPT。如果当前 chat 没有文件或终端工具，先切换到能执行本机任务的环境。

```text
请在当前电脑为 ChatGPT 桌面版安装这个完整插件：
https://github.com/ZiChen-Whisper/maimemo-codex-plugin

先读取 README 和插件配置，检查 Node.js >=22、Git 及桌面版的插件安装能力。
使用官方支持的 marketplace 流程，把 maimemo-community 插件源加入当前用户，
安装并启用 maimemo-codex-plugin。我要完整插件，不能只安装两个 skill。

优先使用桌面版自带的 codex 可执行文件。旧独立 CLI 如果不兼容，不要修改我的全局配置
来绕过。保留其他插件和配置。如果已经有同名插件源，先检查来源和版本，不擅自替换
或移除。缺少依赖或需要我点击权限提示时，告诉我具体怎么做。

token 不要让我发到聊天里，也不要展示已有 token。尚未配置时，请定位已安装插件里的
scripts/configure.ps1，让我在可操作的本地终端中隐藏输入。不要伪造网页授权流程。

安装后检查 MCP 能启动并发现 25 个工具。当前 chat 不能加载新工具时，告诉我要新开
chat。有了工具和 token 后，只查询 apple 验证连接，不修改墨墨数据。
最后告诉我从哪里查看插件，以及下一句话该怎么开始使用。
```

这段话让 ChatGPT 代办本机安装，不会把墨墨 token 上传到 GitHub。不同桌面版本的工具和权限不同；不能执行命令时，可以按下面的流程操作。

### 官方支持的流程：一行添加插件源，再在界面安装

在可用的本地终端执行：

```powershell
codex plugin marketplace add ZiChen-Whisper/maimemo-codex-plugin --json
```

**这一行只添加并下载插件源，还需要在桌面版点击安装。** 无须手动 clone 或运行 `npm install`，仓库已有打包的服务器文件。

1. 重新启动 ChatGPT 桌面版。
2. 打开 **Plugins / 插件**，在来源选择器中选择 **MaiMemo Community**（技术名称 `maimemo-community`）。
3. 找到 **maimemo-codex-plugin**，打开详情，点击 **＋ / Install**，完成宿主显示的权限提示。
4. 在 **Installed / 已安装**确认插件启用。配置 token 后，新开本地 chat 使用。

依据 [OpenAI 桌面插件说明](https://learn.chatgpt.com/docs/plugins)和[插件源安装说明](https://developers.openai.com/plugins/build/plugins)，核对日期为 2026-10-04。界面文字可能随版本变化。

如果提示 `codex` 找不到，或旧 CLI 无法解析配置，用上面的安装请求，让本地 ChatGPT 找到桌面版自带的可执行文件。本项目在 Windows 通过内置 CLI 安装过，见[验证范围](docs/verification.md)。日常聊天不需要切换到 CLI。

**官方支持的安装机制与官方公共目录是两件事。** 本项目通过 GitHub 自建源分发，尚未提交 OpenAI 公共目录，因此添加来源前不能靠全局搜索找到它；目前没有可点击即完成首次安装的公共目录链接。

### npm / npx 能安装吗？

当前没有发布 `npx maimemo-codex-plugin` 安装器。完整插件请用上述安装请求或官方 marketplace 流程。

`npx skills add ZiChen-Whisper/maimemo-codex-plugin` 使用第三方 skills CLI，只装 skill，不配置墨墨 MCP 或 token，不能替代完整插件。`npm ci` 用于开发者安装依赖，普通桌面用户不用执行。

## 连接你的墨墨账号

### 获取并隐藏输入 token

在墨墨背单词 App 打开 **我的 → 更多设置 → 实验功能 → 开放 API**，取得自己的 token。桌面版安装的权限提示不等于已经连接墨墨；本插件不提供“使用 ChatGPT 登录墨墨”的流程。

可以对本地 ChatGPT 说：

```text
请定位已安装 maimemo-codex-plugin 的 scripts/configure.ps1，给我打开或说明如何使用
本地终端运行它。我会自己在隐藏输入提示中填写 token，不把 token 发到聊天。
```

已经知道安装位置时，在可操作的 Windows 终端运行，替换为实际路径：

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File "<插件安装目录>\scripts\configure.ps1"
```

默认缓存在 `%USERPROFILE%\.codex\plugins\cache\maimemo-community\maimemo-codex-plugin\`，在版本子目录里找 `scripts\configure.ps1`。子目录名因安装方式而异，不要只照抄版本号；自定义 CODEX_HOME 时位置也会变化。

输入时不显示字符，完成后按回车。脚本保存到 `%USERPROFILE%\.config\maimemo-codex-plugin\token`，限制 Windows 目录权限为当前用户。文件是受权限保护的明文，不是加密凭证保险库。新开 chat 后验证：

```text
使用 maimemo-codex-plugin 检查本地配置，再查询 apple 验证远端 token。
告诉我连接是否成功，不要显示 token，不修改我的数据。
```

`configured=true` 只表示本地有 token；成功查询 apple 才验证了远端凭证。

### 更换或移除 token

重新运行脚本更换 token，传入 `-Remove` 移除新路径文件。也支持 `MAIMEMO_TOKEN` 环境变量，启动桌面应用的进程必须能继承它；修改后重启应用。

仍兼容旧目录 `.config/maimemo-plugin/token`。优先级为环境变量、新文件、旧文件；完全断开时需清除实际使用的来源，`-Remove` 只移除新文件。不要让助手读取或展示凭证文件。

## 在桌面聊天里怎么使用

安装、启用并配置后，**新开 chat**。直接写“使用墨墨插件……”即可；也可键入 `@`，从选择器选中 **maimemo-codex-plugin** 或其 skill，再描述需求。应从选择器选中，单纯粘贴 `@名称` 不等于选中插件。[官方调用方式](https://learn.chatgpt.com/docs/plugins)

以下提示词可直接复制。词本名称是示例，请替换成自己的名称；有同名词本时先选定 ID。

### 1. 查一个词，并读懂它

```text
使用墨墨插件查询 resilient。确认是否收录，再读取可用的释义、例句和助记。
将 API 返回内容与 AI 补充讲解分开标注，用中文解释适用场景，不保存任何内容。
```

**结果：** 聊天里显示词库 ID、拼写及可用素材。基本查词接口只返回 ID 和拼写，其他素材需另查；为空时 AI 可以补写解释，但不能说是墨墨返回的内容。

### 2. 批量检查一组生词

```text
用墨墨插件批量查询 resilient、sustain、comprise、sustian。
列出输入拼写、是否收录和返回 ID。疑似拼错的词给建议，不擅自替换或加词。
```

**结果：** 得到查询与未匹配清单。后续加词使用实际返回的 ID，不能猜测 ID。

### 3. 从阅读材料提取生词

```text
从这段文章挑出适合六级的词汇，去重、检查词形，再用墨墨插件查询是否收录。
先给候选词清单和中文解释，不创建词本，不加入学习计划。

A resilient economy can sustain growth, but accurate forecasts comprise many uncertain assumptions.
```

**结果：** 聊天里显示候选清单。也可以附上自己的文章或文件，助手需要能读取该附件或本地文件。

### 4. 保存为云词本草稿

```text
把 resilient、sustain、comprise 创建为新的墨墨云词本草稿。
标题：六级阅读生词；简介：本周阅读积累；标签：六级、阅读；状态：未发布。
先核对收录情况，列出未匹配词。成功后返回 ID、标题和状态。这次不加入学习计划。
```

**结果：** 真实创建云词本，状态 `UNPUBLISHED`。需要发布时继续说“将刚才 ID 为……的词本设为已发布，保留内容不变”，再在 App 检查同步结果。失败不能当成已保存。

### 5. 查看词本，并追加单词

先找词本：

```text
使用墨墨插件列出我的云词本，显示标题、ID 和状态。读取“六级阅读生词”的完整内容。
如果有同名词本，先让我选，不直接修改。
```

选定后继续：

```text
向刚才选定的词本追加 assumption 和 forecast。先读当前内容，去重，保留已有内容
及其他字段。更新成功后告诉我新加了哪些词，不加入学习计划。
```

**结果：** 第二步真实更新词本，不另建词本，不把原来的内容覆盖成两个新词。

### 6. 加入墨墨学习计划

```text
将 resilient、sustain、comprise 加入我的墨墨学习计划，不提前复习。
先查实际词库 ID，再执行加词。报告 added_count 和未收录的词，不假设全部成功。
```

**结果：** 改变学习计划。保存云词本不等于加入学习计划；重复词和容量上限会影响成功数量。

### 7. 今天背了多少、还剩多少

```text
读取墨墨今日进度，告诉我已完成、今日总量、剩余数量及学习时长，把毫秒换成分钟。
若当天未初始化或同步不完整，说明限制，不猜测数量。
```

**结果：** 按真实 `finished`、`total`、`study_time` 汇总。进度接口不直接给新学/复习分项，需要分项时再查今日单词列表。

### 8. 用未完成的词做自测

```text
用墨墨插件读取今天未完成的词，最多选 10 个，区分新学和复习。只获取了部分列表时
请标明。先出一道中译英题，等我回答再出下一题，不提前展示全部答案。
```

**结果：** 在聊天里逐题练习。判分是聊天辅导，**不会写回墨墨的记忆等级、答题反馈或打卡记录**；当前 API 没有这些写入能力。

### 9. 查看某个词的学习记录

```text
查我对 resilient 的墨墨学习记录，展示实际返回的学习次数、最近学习时间、下次学习
时间和反馈字段。缺失字段写“未返回”，别把查不到解释成从未学过。
```

**结果：** 读取已有记录，不修改复习安排。它不是完整历史事件导出，不能据此编造几周的学习曲线。

### 10. 看明天计划复习的词

```text
用墨墨插件按北京时间查询明天 00:00:00 到 23:59:59 的下次学习计划。
先查询数量，再列出最多 20 个单词，标明只是列表样本，不提前复习。
```

**结果：** 按 `next_study_date` 筛选记录。“明天”按请求发起日期计算，不是固定示例日期。

### 11. 编例句，确认后保存

先生成：

```text
为 resilient 写一句适合六级阅读的英文例句，配中文翻译。标明 AI 生成，只展示，
不要保存到墨墨。
```

确认后继续：

```text
用墨墨插件把刚才那条例句和翻译保存到 resilient 的例句中。来源注明 AI 生成，
标签写“六级”。保存成功后返回实际记录 ID。
```

**结果：** 第二步真实创建例句。助记、释义也有对应工具；写入须有明确内容，并填写接口要求的类型或状态。

### 12. 提前复习已有单词

```text
用墨墨插件将 resilient 和 sustain 提前到现在复习。先确认它们在我的学习记录中，
再执行，返回实际 advanced_count。账号未解锁功能时直接告诉我。
```

**结果：** 真实调整复习安排。官方说明需达到 10 级解锁，公测期间仍以实际接口结果为准。

### 第一次建议这样走

先 **1 查词 → 2 批量核对 → 4 建草稿 → 5 查看词本 → 7 看进度 → 8 自测**。想真正开始背新词，再做 **6 加入学习计划**。也可以只用查询与聊天辅导。

写操作需明确对象和动作；工具还要求 `confirm=true`，由助手根据授权传入。已有清楚授权无须重复询问；该字段只是调用方声明，不代替宿主权限。写入超时先查结果，避免重复创建。

## 功能与限制

| 功能 | 内容 | 数据影响 |
| --- | --- | --- |
| 查词库 | 单个拼写、批量拼写或 ID；基本信息为 ID 和拼写 | 只读 |
| 云词本 | 列表、详情、创建、更新、删除 | 创建、更新、删除会写入 |
| 学习素材 | 查询、创建、更新、删除例句、助记、释义 | 创建、更新、删除会写入 |
| 学习复盘（公测） | 今日进度、今日单词、学习记录 | 只读 |
| 学习操作（公测） | 加词、提前复习 | 改变学习计划 |

学习接口需 App 开启自动同步，当天打开 App 初始化，公测期间可用性可能变化。不含墨墨记忆卡 Markji、模拟手机按钮、自动答题或自动打卡。写工具已按官方 schema 做本地请求测试，尚未逐一对真实账号写入验收，见[验证范围](docs/verification.md)。

## 连接失败时

| 现象 | 怎么处理 |
| --- | --- |
| 添加来源后看不到插件 | 重启桌面应用，选择 MaiMemo Community；repo 来源需在对应本地项目中查看 |
| 已安装，但 @ 找不到或没有工具 | 确认启用、新开本地 chat；检查 Node、MCP 日志与 chat 运行环境 |
| 有两个 skill，却没有墨墨工具 | 可能只装了 skill；安装完整插件，检查服务器启动 |
| 找不到 token | 运行安装目录的 configure.ps1，检查旧环境变量是否遮盖新文件 |
| 401 | token 可能无效或过期，重新配置后查 apple |
| 403 | 检查账号权限和接口开放情况 |
| 429 | 等待再试；多个客户端共用账号频控 |
| 学习数据为空或不准 | 在墨墨 App 开启自动同步并打开 App 初始化，再查询 |
| 写入超时 | 先查实际词本或记录，确定是否已保存，再决定重试 |

按进程串行调用，间隔至少 2 秒，不自动重试写操作。官方频控为 10 秒 20 次、60 秒 40 次、背单词 5 小时 2000 次；例句、助记、释义每天最多合计创建 600 条。多个进程与持续调用仍可能触发累计限制。

## CLI 与开发者入口

### 使用新版 CLI 直接安装

```powershell
codex plugin marketplace add ZiChen-Whisper/maimemo-codex-plugin --json
codex plugin add maimemo-codex-plugin@maimemo-community --json
```

配置 token 后，新开桌面 chat 或 CLI 会话。修改源码时可先 clone，再将本地目录作为来源：

```powershell
git clone https://github.com/ZiChen-Whisper/maimemo-codex-plugin.git
cd maimemo-codex-plugin
codex plugin marketplace add . --json
codex plugin add maimemo-codex-plugin@maimemo-community --json
```

Git 来源用 `codex plugin marketplace upgrade maimemo-community` 刷新，然后在 Plugins 核对新版本并更新/重新安装。刷新来源和更新已安装副本是两步；本地目录来源修改源文件后重新安装。

### 开发验证

```powershell
npm ci
npm test
npm run build
npm run smoke
node scripts/smoke.mjs --live
```

`--live` 只查询 apple、词本列表和今日进度，输出状态与响应字段名，不打印私人内容。源码或 schema 变更后重新 build，并提交同步的 `server/dist/`。

参数见 [docs/tools.md](docs/tools.md)。schema 来自官方 YML，原始导出不随仓库发布。重新生成需 Python 和 PyYAML：

```powershell
python scripts/generate_catalog.py <你的官方YML路径>
npm run build
```

## 隐私与许可证

请求只发送到 `https://open.maimemo.com/open`，拒绝重定向，token 只用于 Authorization。插件无遥测，不在磁盘记录 API 响应。词本与学习数据会进入发起调用的 AI chat；聊天同步由宿主设置决定。

自编代码采用 [MIT](LICENSE)。接口名称、schema 和说明来自墨墨官方文档，墨墨商标及服务归原权利人；MIT 不授权使用墨墨服务或第三方内容。依赖许可证见 [THIRD_PARTY_NOTICES.md](server/dist/THIRD_PARTY_NOTICES.md)。
