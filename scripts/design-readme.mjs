import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
const assets = 'assets/readme';
mkdirSync(assets, { recursive: true });
const escape = s => s.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
const sans = 'Segoe UI,Microsoft YaHei,PingFang SC,sans-serif';
function svg(title, width, height, body) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-labelledby="title desc">\n  <title id="title">${escape(title)}</title>\n  <desc id="desc">${escape(title)} · maimemo-codex-plugin README</desc>\n${body}\n</svg>\n`;
}
const hero = svg('maimemo-codex-plugin：在 ChatGPT 桌面版中使用墨墨背单词',1200,420,`  <rect width="1200" height="420" rx="24" fill="#262d2b"/>
  <g id="wordmark" font-family="${sans}">
    <text x="56" y="61" font-size="21" letter-spacing="2" fill="#a6c6b6">MAIMEMO-CODEX-PLUGIN / CHATGPT DESKTOP</text>
    <text x="50" y="203" font-size="132" font-weight="750" letter-spacing="-7" fill="#faf9f4">maimemo<tspan fill="#64b69a">.</tspan></text>
    <text x="56" y="267" font-size="37" fill="#faf9f4">把你的词本，带进每一次对话。</text>
    <text x="56" y="365" font-size="28" fill="#b0d3bf">24 API 工具</text>
    <text x="256" y="365" font-size="28" fill="#b0d3bf">2 个 skill</text>
    <text x="446" y="365" font-size="23" fill="#c6d1c9">本地 token · 非官方插件</text>
  </g>
  <g id="vocabulary-card" transform="translate(818 72)" font-family="${sans}">
    <rect x="13" y="13" width="300" height="282" rx="16" fill="#41564c"/>
    <rect width="300" height="282" rx="16" fill="#f5f2e9"/>
    <path d="M235 0h38v58l-19-12-19 12z" fill="#197d64"/>
    <text x="28" y="43" font-size="18" letter-spacing="2" fill="#60756b">WORD NOTEBOOK</text>
    <text x="27" y="112" font-size="45" font-weight="650" letter-spacing="-1" fill="#263d33">resilient</text>
    <path d="M28 139h244" stroke="#d2ddd1" stroke-width="2"/>
    <text x="28" y="179" font-size="26" fill="#54685c">sustain</text>
    <text x="28" y="217" font-size="26" fill="#54685c">comprise</text>
    <text x="28" y="258" font-size="21" fill="#197d64">查词 → 云词本 → 学习复盘</text>
  </g>`);
writeFileSync(`${assets}/hero.svg`,hero);

const sections = [
  ['ChatGPT 桌面版怎么安装','如何安装','INSTALL ON DESKTOP','desktop-install'],
  ['适用范围','适用范围','BEFORE YOU START','overview'],
  ['连接你的墨墨账号','连接你的墨墨账号','CONNECT YOUR ACCOUNT','connect-account'],
  ['在桌面聊天里怎么使用','从第一句，到日常使用','12 WORKFLOWS / COPY & TRY','examples'],
  ['功能与限制','功能与边界','CAPABILITIES & LIMITS','capabilities'],
  ['连接失败时','连接排查','WHEN SOMETHING GOES WRONG','troubleshooting'],
  ['CLI 与开发者入口','开发者入口','CLI & DEVELOPMENT','developers'],
  ['隐私与许可证','隐私与许可证','PRIVACY & LICENSE','privacy'],
];
const subtitles = [
  ['推荐：复制这段话，让 ChatGPT 帮你安装','让 ChatGPT 帮你安装','A','DESKTOP'],
  ['官方支持的流程：一行添加插件源，再在界面安装','添加插件源，在桌面点安装','B','DESKTOP'],
  ['npm / npx 能安装吗？','npm / npx 能安装吗？','C','INSTALLATION'],
  ['获取并隐藏输入 token','获取并隐藏输入 token','01','ACCOUNT'],
  ['更换或移除 token','更换或移除 token','02','ACCOUNT'],
  ['1. 查一个词，并读懂它','查一个词，并读懂它','01','READ'],
  ['2. 批量检查一组生词','批量检查一组生词','02','READ'],
  ['3. 从阅读材料提取生词','从阅读材料提取生词','03','READ + AI'],
  ['4. 保存为云词本草稿','保存为云词本草稿','04','WRITE'],
  ['5. 查看词本，并追加单词','查看词本，并追加单词','05','READ → WRITE'],
  ['6. 加入墨墨学习计划','加入墨墨学习计划','06','WRITE'],
  ['7. 今天背了多少、还剩多少','今天背了多少，还剩多少','07','READ'],
  ['8. 用未完成的词做自测','用未完成的词做自测','08','READ + AI'],
  ['9. 查看某个词的学习记录','查看单词的学习记录','09','READ'],
  ['10. 看明天计划复习的词','看明天计划复习的词','10','READ'],
  ['11. 编例句，确认后保存','编例句，确认后保存','11','AI → WRITE'],
  ['12. 提前复习已有单词','提前复习已有单词','12','WRITE'],
  ['第一次建议这样走','第一次建议这样走','→','START HERE'],
  ['使用新版 CLI 直接安装','使用新版 CLI 直接安装','01','DEVELOPERS'],
  ['开发验证','开发与验证','02','DEVELOPERS'],
];
for(const [i, [original,title,label]] of sections.entries()) {
  const n=String(i+1).padStart(2,'0');
  writeFileSync(`${assets}/section-${n}.svg`, svg(original,1200,144,`  <rect width="1200" height="144" rx="16" fill="#f4f2eb"/>
  <path d="M48 0h34v41L65 32 48 41z" fill="#197d64"/>
  <g font-family="${sans}">
    <text x="102" y="41" font-size="19" letter-spacing="2" fill="#647c6e">${escape(label)}</text>
    <text x="48" y="108" font-size="48" font-weight="650" fill="#29392f">${escape(title)}</text>
    <text x="1116" y="112" text-anchor="end" font-size="78" font-weight="700" fill="#d0ddd2">${n}</text>
  </g>`));
}
for(const [i,[original,title,n,label]] of subtitles.entries()) {
  writeFileSync(`${assets}/topic-${String(i+1).padStart(2,'0')}.svg`,svg(original,1200,84,`  <rect width="1200" height="84" rx="10" fill="#ffffff"/>
  <rect x="0" y="10" width="70" height="64" rx="10" fill="#e7eee7"/>
  <text x="35" y="55" text-anchor="middle" font-family="${sans}" font-size="29" font-weight="600" fill="#197d64">${escape(n)}</text>
  <text x="96" y="58" font-family="${sans}" font-size="43" font-weight="600" fill="#2b3c33">${escape(title)}</text>
  <text x="1180" y="54" text-anchor="end" font-family="${sans}" font-size="19" letter-spacing="1" fill="#647c6e">${escape(label)}</text>`));
}
let readme=readFileSync('README.md','utf8').replaceAll('\r\n','\n');
// Revert generated heading markup first so the generator is idempotent.
readme=readme.replace(/<a id="[^"\n]+"><\/a>\n\n/g,'');
readme=readme.replace(/^(#{2,3}) !\[([^\]]+)\]\(assets\/readme\/(?:section|topic)-\d+\.svg\)$/gm,'$1 $2');
readme=readme.replace(/^# maimemo-codex-plugin\n\n/m,'');
readme=readme.replace(/^<p align="center"><img src="assets\/readme\/hero.svg"[^\n]*<\/p>/m, '# ![maimemo-codex-plugin · 在 ChatGPT 桌面版使用墨墨](assets/readme/hero.svg)');
for(const [i,[original,, ,anchor]] of sections.entries()) {
  readme=readme.replace(`## ${original}\n`, `<a id="${anchor}"></a>\n\n## ![${original}](assets/readme/section-${String(i+1).padStart(2,'0')}.svg)\n`);
}
for(const [i,[original]] of subtitles.entries()) {
  readme=readme.replace(`### ${original}\n`,`### ![${original}](assets/readme/topic-${String(i+1).padStart(2,'0')}.svg)\n`);
}
const nav='<p align="center">\n  <a href="#desktop-install">桌面安装</a> · <a href="#connect-account">连接账号</a> · <a href="#examples">12 个使用示例</a> · <a href="#troubleshooting">连接排查</a>\n</p>\n\n';
readme=readme.replace(nav,'');
const start=readme.indexOf('\n\n');
readme=readme.slice(0,start+2)+nav+readme.slice(start+2);
writeFileSync('README.md',readme);
console.log(`Created hero + ${sections.length} section titles + ${subtitles.length} topic titles.`);
