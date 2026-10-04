# README 设计记录

- Audience：希望通过 ChatGPT 桌面版使用墨墨的中文用户。
- One-sentence value：自然语言查词、整理云词本和复盘学习。
- Primary proof：25 个工具发现和三个真实读取接口；写接口验证范围单独列明。
- First successful action：桌面版新开本地 chat，检查配置后查询 resilient。
- Visual theme：词汇笔记、页签和编号；29 张静态纯 SVG 标题图，插件图标保持用户提供的猫头鹰 PNG。
- Palette：墨黑 #262d2b、青绿 #197d64、暖白 #faf9f4、纸页色 #f4f2eb、灰绿 #647c6e。
- Typography：系统 sans-serif；首图主标题 132、章节标题 48、小节标题 43，SVG 画布宽 1200。
- Shape：首图 24 圆角、章节 16 圆角、小节 10 圆角；页签、纸页和数字标记贯穿整页。
- Motif：首图词汇卡片、章节书签、小节编号；首图中的单词是示意内容，不是用户账号数据。
- Composition：1 张首图、8 张章节标题、20 张小节标题（含 12 个使用示例）；参考 beautify-github-readme 仓库的标题层级，按墨墨项目重新设计。

标题保留 Markdown H1/H2/H3 层级和图片替代文字；章节使用稳定的显式锚点。安装命令、账号配置和示例仍为可复制的 Markdown。导航放在首图之后。

运行 `node scripts/design-readme.mjs` 可重新生成标题图和 README 标题；重复运行保持内容一致。图中没有外链字体、脚本或远程资源。

已检查 900 像素和 360 像素内容宽度的完整 README 预览、全部标题及末尾排版，并检查 29 张 SVG 的文字边界。窄屏不依赖图内小字完成安装；辅助英文和首图小字允许作为装饰信息缩小。预览与检查结果保存在忽略的 `output/playwright/` 目录。
