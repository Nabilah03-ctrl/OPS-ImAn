import {chromium} from 'playwright-core';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {ITEMS} from '../dist/content.js';
import {makeMaze} from '../dist/engine.js';
import {STATION_MAP_VERSION} from '../dist/station-layouts.js';
const origin=process.env.QA_ORIGIN||'http://127.0.0.1:4189';
const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
const errors=[],checks=[];
try{
 const context=await browser.newContext({serviceWorkers:'block',viewport:{width:1280,height:950},reducedMotion:'reduce'});
 const p=await context.newPage();p.on('pageerror',e=>errors.push(e.message));
 await p.goto(origin);await p.locator('[data-action=new]').click();await p.locator('#student-name').fill('Ujian Pilihan');await p.locator('#student-class').fill('2 Bestari');await p.locator('#mode').selectOption('guidance');await p.locator('#setup-form [type=submit]').click();await p.locator('[data-action=close]').click();await p.locator('[data-action=level][data-level="1"]').click();await p.locator('.station-stop[data-index="0"]').click();await p.locator('.question-text').waitFor();
 const choices=()=>p.locator('[data-action=answer]').evaluateAll(els=>els.map(el=>el.dataset.answer));
 const order=await choices();assert.equal(order.length,3);
 await p.locator('[data-answer=baca]').click();assert.deepEqual(await choices(),order);
 await p.locator('[data-power=two]').click();assert.deepEqual(await choices(),order);assert.ok(await p.locator('.hint-box').isVisible());
 await p.reload();await p.locator('[data-action=resume]').click();await p.locator('.question-text').waitFor();assert.deepEqual(await choices(),order);
 await p.locator('[data-answer=membaca]').click();assert.ok(await p.locator('.feedback.correct').isVisible());
 checks.push('Three choices in guidance, stable order after wrong answer, help and reload, correct answer accepted');
 const data=await p.evaluate(()=>JSON.parse(localStorage.getItem('ops-iman-v1'))),s=data.sessions[0];s.level=2;s.mode='standard';s.audio=false;s.records={};s.stationMapVersions[2]=STATION_MAP_VERSION;s.positions[2]=makeMaze(2).points[1].challenge;
 for(const item of ITEMS.filter(i=>i.level===1||i.id==='P2-C1'))s.records[item.id]={level:item.level,complete:true,attempts:1,hints:0,powers:[]};
 await p.addInitScript(data=>{if(!sessionStorage.getItem('focus-fixture')){localStorage.setItem('ops-iman-v1',JSON.stringify(data));sessionStorage.setItem('focus-fixture','1');}},data);await p.reload();await p.locator('[data-action=resume]').click();await p.locator('[data-scene="2-2"]').waitFor();
 assert.equal(await p.locator('.station-question image').count(),1);assert.equal(await p.locator('.station-question image').getAttribute('href'),'assets/v2/action-helping.png');
 await p.locator('.station-question').screenshot({path:'artifacts/focused-helping-desktop.png'});
 await p.setViewportSize({width:390,height:844});assert.ok(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));await p.locator('.station-question').screenshot({path:'artifacts/focused-helping-mobile.png'});
 await p.locator('[data-action=activity-match-a]').click();assert.equal(await p.locator('[data-action=activity-match-b]').count(),3);await p.locator('[data-action=activity-match-b][data-value=membantu]').click();await p.locator('[data-action=activity-submit]').click();assert.ok(await p.locator('.feedback.correct').isVisible());
 checks.push('P2-C2 has one large helping illustration on desktop and mobile; all three matching choices work');
 await context.close();

 // Exercise the production hand loop with deterministic video frames and synthetic landmarks.
 // This tests dwell timing and repeat prevention, not physical hand detection accuracy.
 const hand=await browser.newContext({serviceWorkers:'block',viewport:{width:800,height:600}});
 await hand.route('**/qa-dwell-fixture',route=>route.fulfill({contentType:'text/html',body:'<button id="target" style="position:fixed;left:300px;top:200px;width:200px;height:200px">Pilih</button><div id="camera-panel"><video id="hand-video"></video><span id="hand-status"></span></div><div id="hand-cursor" style="pointer-events:none"><svg><circle class="dwell-ring"/></svg></div>'}));
 await hand.route('**/vendor/vision_bundle.js*',route=>route.fulfill({contentType:'text/javascript',body:'export const FilesetResolver={forVisionTasks:async()=>({})};export const HandLandmarker={createFromOptions:async()=>({detectForVideo:()=>({landmarks:window.qaMissing?[]:[Array.from({length:21},()=>({x:.5,y:.5}))]})})};'}));
 const h=await hand.newPage();h.on('pageerror',e=>errors.push(e.message));await h.goto(origin+'/qa-dwell-fixture');
 const timing=await h.evaluate(async()=>{
  let callback,frame=0,clicks=0,stopped=false;window.requestAnimationFrame=fn=>{callback=fn;return 1;};window.cancelAnimationFrame=()=>{callback=null;};
  navigator.mediaDevices.getUserMedia=async()=>({getTracks:()=>[{stop:()=>{stopped=true;}}]});const v=document.querySelector('video');Object.defineProperties(v,{srcObject:{value:null,writable:true},readyState:{get:()=>2},currentTime:{get:()=>frame/1000}});v.play=async()=>{};
  document.querySelector('#target').addEventListener('click',()=>clicks++);
  const {startHands,stopHands}=await import('./hands.js');await startHands({sensitivity:1,onError:e=>{throw e;}});
  const tick=time=>{frame=time;callback(time);};tick(100);tick(1020);const before=clicks;tick(1100);const atOneSecond=clicks;tick(1600);tick(2400);const held=clicks;
  stopHands();return {before,atOneSecond,held,stopped};
 });
 assert.deepEqual(timing,{before:0,atOneSecond:1,held:1,stopped:true});checks.push('Hand dwell activates at 1000 ms, not at 920 ms, and does not repeat while held');await hand.close();
 assert.deepEqual(errors,[]);const report={passed:true,origin,checks,errors};fs.writeFileSync('artifacts/qa-focus-controls.json',JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));
}finally{await browser.close();}
