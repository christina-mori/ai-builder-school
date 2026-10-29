/* Export existing sample lessons as standalone, downloadable HTML files. */
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.resolve(__dirname, '..');
const read = name => fs.readFileSync(path.join(root, 'dist', name), 'utf8');
const app = read('app.js'), learning = read('learning.js'), experience = read('experience.js');
const context = vm.createContext({document:{addEventListener(){}},resource(){}});
vm.runInContext(`function esc(s=''){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}\n${app.slice(app.indexOf('const resources='), app.indexOf('const people='))}\n${learning}\n${experience.slice(experience.indexOf('const taskCatalog'), experience.indexOf('if (!saved.knowledge'))}\n${experience.split('\n').find(line=>line.startsWith('resources.push('))}`, context);
const lessons = vm.runInContext(`resources.map(r=>({...r,body:r.id===4?ragLesson():'<h2>可以这样开始</h2><ol>'+r.steps.map(s=>'<li>'+esc(s)+'</li>').join('')+'</ol><h2>提示模板</h2><pre>'+esc(r.prompt)+'</pre>'}))`, context);
const dir = path.join(root,'dist','resources');fs.mkdirSync(dir,{recursive:true});
for(const lesson of lessons){
 const escape = value => String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 // The interactive RAG lesson remains available in the app; its file contains the complete reading material.
 const body = lesson.body.replace(/<button\b[\s\S]*?<\/button>/g,'').replace(/<div id="rag-result"[\s\S]*?<\/div>/,'<p>切片实验对照：仅给正文时无法确定周次；保留标题与版本可确认 W1 周日提交；住宿问题没有对应资料，应说明无法回答。</p>');
 fs.writeFileSync(path.join(dir,`lesson-${lesson.id}.html`),`<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'unsafe-inline'; base-uri 'none'; form-action 'none'"><title>${escape(lesson.title)} · AI Builder School</title><style>body{max-width:820px;margin:40px auto;padding:0 24px;color:#403c36;background:#fffcf5;font:17px/1.9 system-ui,sans-serif}h1{font-size:30px}h2,h3{margin-top:32px}pre,.prompt{white-space:pre-wrap;overflow-wrap:anywhere;background:#f0eadc;padding:20px}table{border-collapse:collapse;width:100%;font-size:14px}td,th{border:1px solid #d5cdbd;padding:8px;text-align:left}.lesson-table{overflow:auto}a{color:#526e85}header,footer{color:#736b61;font-size:14px}footer{margin-top:40px;border-top:1px solid #d5cdbd;padding-top:16px}</style></head><body><header>AI BUILDER SCHOOL · 示例锦囊 · ${escape(lesson.level)} / ${escape(lesson.type)}</header><main><h1>${escape(lesson.title)}</h1><p>${escape(lesson.desc)}</p>${body}</main><footer>这是课程平台的示例材料，正式内容以教练发布为准。HTML 文件可下载后用浏览器打开。</footer></body></html>\n`);
}
console.log(`Exported ${lessons.length} sample HTML resources.`);
