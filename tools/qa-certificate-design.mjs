import {chromium} from 'playwright-core';
import {PDFDocument} from 'pdf-lib';
import fs from 'node:fs';
import assert from 'node:assert/strict';
import {ITEMS} from '../dist/content.js';
const origin=process.env.QA_ORIGIN||'http://127.0.0.1:4189';
const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
const errors=[],pdfs=[];
try{
 const context=await browser.newContext({viewport:{width:1500,height:1100},serviceWorkers:'block'});
 const session={contentVersion:3,id:'certificate-design-qa',name:'Nur Aisyah Humaira',className:'2 BETA',avatar:'hijab',mode:'standard',control:'mouse',createdAt:'2026-10-21T00:00:00Z',completedAt:'2026-10-21T01:00:00Z',level:6,positions:{},records:Object.fromEntries(ITEMS.map(i=>[i.id,{id:i.id,level:i.level,complete:true,attempts:3,hints:2,powers:["hint"],answers:[i.answer],accuracy:true,gameType:i.type,shownExample:true,completedAt:'2026-10-21T01:00:00Z'}])),stars:30,activeMs:417000,levelMs:{},completedLevels:[1,2,3,4,5,6],powers:{},powerLog:[],practice:[],audio:false,assist:[],teacher:{},codeDigits:['0','2','7','1','6','3'],finalMission:{complete:true,completedAt:'2026-10-21T01:00:00Z',activeMs:417000}};
 const fixture={contentVersion:3,saveVersion:3,currentId:session.id,settings:{teacherName:'Cikgu Farah',schoolName:'Sekolah Kebangsaan ImAn'},sessions:[session],overrides:{}};
 await context.addInitScript(data=>{
  window.print=()=>window.__printed=true;
  if(!localStorage.getItem('certificate-design-seeded')){localStorage.setItem('ops-iman-v1',JSON.stringify(data));localStorage.setItem('certificate-design-seeded','true');}
 },fixture);
 const p=await context.newPage();p.on('pageerror',e=>errors.push(e.message));await p.goto(origin);
 await p.locator('[data-action=map]').click();await p.locator('[data-action=certificate-view]').first().click();
 await p.evaluate(()=>document.fonts.ready);
 assert.equal(await p.locator('.certificate-stars span').count(),18);
 assert.ok(await p.locator('#certificate-mute').isChecked());
 assert.doesNotMatch(await p.locator('.certificate-art').textContent(),/TP\d|markah|kedudukan|kesalahan/i);
 async function download(label){
  const pending=p.waitForEvent('download');await p.locator('[data-action=certificate-download]').click();const file=await pending;
  assert.match(file.suggestedFilename(),/^Sijil_OPS_ImAn_.+\.pdf$/);
  const dest=`artifacts/certificate-${label}.pdf`;await file.saveAs(dest);
  const bytes=fs.readFileSync(dest),doc=await PDFDocument.load(bytes),{width,height}=doc.getPage(0).getSize();
  assert.equal(doc.getPageCount(),1);assert.ok(Math.abs(width-841.89)<.1&&Math.abs(height-595.28)<.1);
  pdfs.push({label,dest,bytes:bytes.length,width,height});
 }
 async function preview(label){await p.locator('.certificate-preview').screenshot({path:`artifacts/certificate-${label}.png`});}
 await preview('redesign-color');await download('redesign-color');
 await p.locator('#certificate-ink').check();await preview('redesign-ink');await download('redesign-ink');
 await p.locator('#certificate-ink').uncheck();
 const name='Nur Aisyah Humaira Binti Muhammad Abdullah Al Amin';
 await p.locator('.certificate-editor summary').click();await p.locator('#certificate-name').fill(name);
 await p.locator('#certificate-teacher').fill('Cikgu Nur Farah Binti Muhammad Abdullah Al Amin');
 await p.locator('#certificate-school').fill('Sekolah Kebangsaan Bandar ImAn, Kuala Lumpur');
 await p.locator('#certificate-form [type=submit]').click();await p.evaluate(()=>document.fonts.ready);
 async function checkBounds(role,left,top,right,bottom){
  const boxes=await p.locator(`[data-role="${role}"]`).evaluateAll(nodes=>nodes.map(n=>{const b=n.getBBox();return {x:b.x,y:b.y,w:b.width,h:b.height,text:n.textContent};}));
  assert.ok(boxes.every(b=>b.x>=left&&b.x+b.w<=right&&b.y>=top&&b.y+b.h<=bottom),JSON.stringify({role,boxes}));return boxes;
 }
 const boxes=await checkBounds('student-name',170,337,1018,445);assert.equal(boxes.map(b=>b.text).join(' '),name);
 await checkBounds('teacher-name',765,735,1095,768);await checkBounds('school-name',109,740,553,778);
 await preview('redesign-long-name');await download('redesign-long-name');
 const pending=context.waitForEvent('page');await p.locator('[data-action=certificate-print]').click();const popup=await pending;
 await popup.waitForFunction(()=>window.__printed);await popup.emulateMedia({media:'print'});assert.equal(await popup.locator('button:visible').count(),0);
 await popup.pdf({path:'artifacts/certificate-redesign-browser-print.pdf',preferCSSPageSize:true,printBackground:true});
 assert.equal((await PDFDocument.load(fs.readFileSync('artifacts/certificate-redesign-browser-print.pdf'))).getPageCount(),1);await popup.close();
 // Extreme input lengths are supported by the editor and must remain complete.
 await p.locator('.certificate-editor summary').click();await p.locator('#certificate-name').fill('W'.repeat(160));
 await p.locator('#certificate-teacher').fill(('Nur Farah Binti Abdullah ').repeat(5).trim());
 await p.locator('#certificate-school').fill(('Sekolah Kebangsaan ImAn ').repeat(5).trim());
 await p.locator('#certificate-form [type=submit]').click();await p.evaluate(()=>document.fonts.ready);
 const extreme=await checkBounds('student-name',170,337,1018,445);assert.equal(extreme.map(b=>b.text).join(''),'W'.repeat(160));
 await checkBounds('teacher-name',765,735,1095,768);await checkBounds('school-name',109,740,553,778);
 await preview('redesign-extreme-name');
 const saved=await p.evaluate(()=>{const d=JSON.parse(localStorage.getItem('ops-iman-v1'));return d.sessions.find(s=>s.id===d.currentId);});
 assert.equal(saved.name,session.name);assert.equal(saved.completedAt,session.completedAt);
 await p.setViewportSize({width:390,height:844});assert.ok(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
 await p.emulateMedia({reducedMotion:'reduce'});await p.locator('[data-action=close]').click();await p.locator('[data-action=certificate-view]').first().click();assert.equal(await p.locator('.certificate-stars').count(),0);
 await p.reload();await p.locator('[data-action=teacher]').click();await p.locator(`[data-action=record][data-id="${session.id}"]`).click();await p.locator('.record-detail [data-action=certificate-view]').click();
 assert.equal((await p.locator('[data-role=student-name]').allTextContents()).join(''),'W'.repeat(160));
 // Inspect the actual downloadable vector PDFs, not only the SVG preview.
 await context.route('**/__qa/pdf*.mjs',route=>route.fulfill({path:route.request().url().endsWith('pdf.worker.mjs')?'node_modules/pdfjs-dist/build/pdf.worker.mjs':'node_modules/pdfjs-dist/build/pdf.mjs',contentType:'text/javascript'}));
 const render=await context.newPage();await render.goto(origin);
 for(const entry of pdfs){
  const result=await render.evaluate(async bytes=>{
   const lib=await import('/__qa/pdf.mjs');lib.GlobalWorkerOptions.workerSrc='/__qa/pdf.worker.mjs';const doc=await lib.getDocument({data:new Uint8Array(bytes)}).promise;
   const page=await doc.getPage(1),viewport=page.getViewport({scale:1.6}),canvas=document.createElement('canvas');canvas.width=viewport.width;canvas.height=viewport.height;document.body.replaceChildren(canvas);
   await page.render({canvasContext:canvas.getContext('2d'),viewport}).promise;
   return (await page.getTextContent()).items.map(i=>i.str).join(' ').replace(/\s+/g,' ');
  },[...fs.readFileSync(entry.dest)]);
  assert.match(result,/SIJIL PENGHARGAAN/);assert.match(result,/Pilih Imbuhan/);assert.match(result,/Guru Bahasa Melayu/);assert.match(result,/21 Oktober 2026/);
  assert.doesNotMatch(result,/TP\d|markah|kedudukan|kesalahan/i);entry.extractedText=result;
  await render.locator('canvas').screenshot({path:`artifacts/certificate-${entry.label}-pdf.png`});
 }
 assert.deepEqual(errors,[]);
 const report={passed:true,pdfs,printPages:1,extremeNamesFit:true,recordReopen:true,datePreserved:true,reducedMotion:true,errors};
 fs.writeFileSync('artifacts/qa-certificate-design.json',JSON.stringify(report,null,2));console.log(JSON.stringify({...report,pdfs:pdfs.map(({extractedText,...p})=>p)},null,2));
}finally{await browser.close();}
