import {chromium} from 'playwright-core';
import {PDFDocument} from 'pdf-lib';
import fs from 'node:fs';
import assert from 'node:assert/strict';
import {ITEMS} from '../dist/content.js';
import {STATION_MAP_VERSION} from '../dist/station-layouts.js';
import {makeMaze} from '../dist/engine.js';
import {makeWordSearch} from '../dist/missions.js';
const origin=process.env.QA_ORIGIN||'http://127.0.0.1:4189';
const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true,args:['--use-fake-device-for-media-stream','--use-fake-ui-for-media-stream']});
const errors=[],checks=[];
function fixture(level,{legacy=false,complete=false,mode='standard',code=['0','2','7','1','6','3']}={}){
 const s={contentVersion:3,id:'access-fixture',name:'Nur Aisyah Humaira Binti Abdullah',className:'2 Bestari',avatar:'hijab',mode,control:'mouse',createdAt:'2026-10-15T00:00:00Z',completedAt:null,certificate:null,level,stationMapVersions:{[level]:STATION_MAP_VERSION},positions:{[level]:makeMaze(level).points[0].challenge},records:{},stars:0,activeMs:93000,levelMs:{},completedLevels:[],powers:{hint:4,radio:4,path:6,two:3,double:2},powerLog:[],practice:[],audio:false,limit:5,cycleCount:0,easy:false,assist:['hint','radio','path','two','double'],targets:['membaca','membantu','mencari','mengawal'],teacher:{tp:'',date:'',notes:'Catatan guru lama'},codeDigits:code};
 for(const i of ITEMS.filter(i=>complete||i.level<level))s.records[i.id]={id:i.id,level:i.level,firstAnswer:i.answer,answers:[i.answer],attempts:3,hints:2,powers:['hint'],shownExample:true,complete:true,accuracy:true,wordCorrect:true,reasonAttempts:0,completedAt:'2026-10-15T01:00:00Z',evidence:'Selepas contoh'};
 return {contentVersion:3,saveVersion:3,currentId:s.id,settings:{},overrides:legacy?{'P1-C1':{prompt:'Suntingan guru terdahulu'}}:{},sessions:[s]};
}
async function openFixture(data,options={}){
 const context=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true,serviceWorkers:'block',reducedMotion:'reduce',...options});
 await context.addInitScript(data=>{if(!localStorage.getItem('fixture-seeded')){localStorage.setItem('ops-iman-v1',JSON.stringify(data));localStorage.setItem('fixture-seeded','1');}},data);const p=await context.newPage();p.on('pageerror',error=>errors.push(error.message));await p.goto(origin);await p.locator('[data-action=resume]').waitFor();return {context,p};
}
const read=p=>p.evaluate(()=>{const data=JSON.parse(localStorage.getItem('ops-iman-v1'));return data.sessions.find(s=>s.id===data.currentId);});
try{
 for(const level of [2,3,4,5,6]){
  const {context,p}=await openFixture(fixture(level,{mode:level===4||level===6?'guidance':'standard'}));
  await p.locator('[data-action=resume]').tap();await p.locator('.question-text').waitFor();const item=ITEMS.find(i=>i.level===level&&i.index===1),act=action=>p.locator(`[data-action=activity-${action}]`);
  assert.ok(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
  if(level===2){await p.locator('[data-action=activity-match-b][data-value=mengawal]').tap();await act('match-target').tap();}
  if(level===3){const cells=makeWordSearch(item).cells,a=cells[0],b=cells.at(-1);await p.locator(`[data-cell="${a.y*8+a.x}"]`).tap();await p.locator(`[data-cell="${b.y*8+b.x}"]`).tap();await p.locator('.word-search').screenshot({path:'artifacts/missions-touch-grid.png'});}
  if(level===4){assert.deepEqual((await read(p)).records[item.id].activity.tokens,[0]);await p.locator('[data-action=activity-piece][data-index="1"]').tap();await p.locator('[data-action=activity-piece][data-index="2"]').tap();}
  if(level===5){await act('blank-slot').tap();await p.locator('[data-action=activity-blank-word][data-value=melawat]').tap();}
  if(level===6){assert.equal((await read(p)).records[item.id].activity.slots[0],item.cards.indexOf('Anggota polis'));for(const slot of [1,2]){await p.locator(`[data-action=activity-card][data-index="${item.cards.indexOf(item.parts[slot])}"]`).tap();await p.locator(`[data-slot="${slot}"]`).tap();}}
  assert.equal((await read(p)).records[item.id].attempts,0);await act('submit').tap();assert.ok(await p.locator('.feedback.correct').isVisible());checks.push(`touch station ${level}${level===4||level===6?' with guidance':''}`);console.log(checks.at(-1));await context.close();
 }
 {
  const {context,p}=await openFixture(fixture(5,{mode:'enrichment'}));await p.locator('[data-action=resume]').tap();await p.locator('#activity-typing').check();await p.locator('#activity-draft').fill('  MELAWAT   ');await p.locator('[data-action=activity-submit]').tap();assert.ok(await p.locator('.feedback.correct').isVisible());checks.push('optional typing ignores case and extra spaces');await context.close();
 }
 {
  const {context,p}=await openFixture(fixture(6,{complete:true}),{viewport:{width:1280,height:1000},isMobile:false});
  const migrated=await p.evaluate(()=>JSON.parse(localStorage.getItem('ops-iman-v1')));assert.equal(migrated.saveVersion,3);assert.equal((await read(p)).teacher.notes,'Catatan guru lama');assert.equal((await read(p)).records['P1-C1'].attempts,3);
  await p.locator('[data-action=map]').click();assert.equal(await p.locator('[data-action=certificate-view]').count(),0);await p.locator('[data-action=final]').click();await p.locator('[data-code-slot="0"]').focus();await p.keyboard.type('027163');await p.locator('[data-action=code-open]').click();await p.locator('.completion-title').waitFor();assert.equal((await read(p)).finalMission.complete,true);assert.equal(await p.locator('.certificate-stars').count(),0);checks.push('resumed edition 3 preserves evidence, leading-zero keyboard code and reduced motion');
  await p.locator('.dialog [data-action=certificate-view]').click();await p.locator('#certificate-ink').check();const downloadPromise=p.waitForEvent('download');await p.locator('[data-action=certificate-download]').click();await(await downloadPromise).saveAs('artifacts/missions-ink-certificate.pdf');const pdf=await PDFDocument.load(fs.readFileSync('artifacts/missions-ink-certificate.pdf'));assert.equal(pdf.getPageCount(),1);assert.ok(pdf.getPage(0).getWidth()>pdf.getPage(0).getHeight());checks.push('ink-saving A4 landscape certificate download');
  const popupPromise=p.waitForEvent('popup');await p.locator('[data-action=certificate-print]').click();const popup=await popupPromise;await popup.waitForLoadState();await popup.emulateMedia({media:'print'});assert.equal(await popup.locator('button:visible').count(),0);await popup.close();checks.push('certificate print excludes controls');
  await p.locator('[data-action=close]').click();await p.locator('[data-action=print]').click();const previewPromise=p.waitForEvent('popup');await p.locator('[data-action=print-preview][data-id=mission-codes]').click();const preview=await previewPromise;await preview.waitForLoadState();assert.equal(await preview.locator('.mission-print-code strong').first().textContent(),'0');await preview.close();checks.push('print preview uses selected session digits');await context.close();
 }
 {
  const context=await browser.newContext({viewport:{width:1280,height:1000},permissions:['camera'],serviceWorkers:'block'}),p=await context.newPage();p.on('pageerror',error=>errors.push(error.message));await p.goto(origin);await p.locator('[data-action=new]').click();await p.locator('#student-name').fill('Ujian Kamera');await p.locator('#student-class').fill('2 A');await p.locator('#setup-form [type=submit]').click();await p.locator('[data-action=close]').click();await p.locator('[data-action=level][data-level="1"]').click();await p.locator('[data-action=controls]').click();await p.locator('[data-action=control-select][data-control=hand]').click();await p.waitForFunction(()=>document.querySelector('#hand-status')?.textContent.includes('Tunjukkan tangan'),{timeout:60000});const elapsed=(await read(p)).activeMs;await p.waitForTimeout(1200);await p.locator('#camera-panel [data-action=mouse]').click();assert.ok((await read(p)).activeMs-elapsed<700);assert.equal((await read(p)).control,'mouse');checks.push('local hand model initializes; missing-hand pause and mouse fallback');await context.close();
 }
 {
  const {context,p}=await openFixture(fixture(6,{complete:true}),{viewport:{width:1280,height:1000},isMobile:false,serviceWorkers:'allow'});
  await p.evaluate(()=>navigator.serviceWorker.ready);await p.locator('[data-action=info]').click();await p.locator('[data-action=cache-offline]').click();await p.waitForFunction(()=>document.querySelector('#offline-progress')?.textContent.includes('tersedia pada pelayar'),{timeout:120000});
  await context.setOffline(true);await p.reload();await p.locator('[data-action=map]').click();await p.locator('[data-action=final]').click();for(const digit of '027163')await p.locator(`[data-action=code-digit][data-digit="${digit}"]`).click();await p.locator('[data-action=code-open]').click();await p.locator('.dialog [data-action=certificate-view]').click();const downloadPromise=p.waitForEvent('download');await p.locator('[data-action=certificate-download]').click();await(await downloadPromise).saveAs('artifacts/missions-offline-certificate.pdf');assert.ok(fs.statSync('artifacts/missions-offline-certificate.pdf').size>10000);checks.push('offline reload, final code and certificate PDF with cached assets');await context.close();
 }
 assert.deepEqual(errors,[]);const result={passed:true,checks,errors};fs.writeFileSync('artifacts/qa-mission-access.json',JSON.stringify(result,null,2));console.log(JSON.stringify(result,null,2));
}finally{await browser.close();}
