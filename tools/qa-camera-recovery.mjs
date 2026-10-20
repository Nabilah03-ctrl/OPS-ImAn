import {chromium} from 'playwright-core';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const origin=process.env.QA_ORIGIN||'http://127.0.0.1:4189';
const browser=await chromium.launch({
 executablePath:process.env.QA_BROWSER||'C:/Program Files/Google/Chrome/Application/chrome.exe',
 headless:true,args:['--use-fake-device-for-media-stream','--use-fake-ui-for-media-stream'],
});
const checks=[],errors=[];
async function newGame(context){
 const page=await context.newPage();page.setDefaultTimeout(30000);
 page.on('pageerror',error=>errors.push(error.message));
 await page.goto(origin,{waitUntil:'domcontentloaded'});
 await page.locator('[data-action=new]').click();
 await page.locator('#student-name').fill('Ujian Kamera');
 await page.locator('#student-class').fill('2 Bestari');
 await page.locator('#control').selectOption('hand');
 await page.locator('#setup-form [type=submit]').click();
 await page.locator('[data-action=close]').click();
 await page.locator('[data-action=level][data-level="1"]').click();
 return page;
}
async function ready(page){
 await page.waitForFunction(()=>document.querySelector('#hand-status')?.textContent.includes('Tunjukkan tangan'),{},{timeout:120000});
 assert.ok(await page.locator('#camera-panel').isVisible());
 assert.equal(await page.locator('[data-action=camera-retry]').count(),0);
 assert.ok(await page.locator('#hand-video').evaluate(video=>video.readyState>=2&&video.srcObject.active));
}
function passed(label){checks.push(label);console.log(label);}
try{
 if(process.env.QA_LIVE==='1'){
  const context=await browser.newContext();
  const page=await newGame(context);await ready(page);
  await page.locator('#camera-panel [data-action=mouse]').click();
  assert.equal(await page.locator('#hand-video').evaluate(video=>video.srcObject),null);
  passed('Published game starts the real hand model with a simulated camera and stops on mouse fallback');
  await context.close();
 }else{
  // A temporary module request failure must recover without leaving the game.
  const automatic=await browser.newContext({serviceWorkers:'block'});
  const requests=[];
  await automatic.route('**/vendor/vision_bundle.js*',route=>{
   requests.push(route.request().url());
   return requests.length===1?route.abort('failed'):route.continue();
  });
  const page=await newGame(automatic);await ready(page);
  assert.equal(requests.length,2);assert.notEqual(requests[0],requests[1]);
  await page.locator('#camera-panel [data-action=mouse]').click();
  assert.equal(await page.locator('#hand-video').evaluate(video=>video.srcObject),null);
  passed('One failed module download retries automatically and initializes the real hand model');
  await automatic.close();

  const manual=await browser.newContext({serviceWorkers:'block'});
  let blocked=true,attempts=0;
  await manual.route('**/vendor/vision_bundle.js*',route=>{attempts++;return blocked?route.abort('failed'):route.continue();});
  const retryPage=await newGame(manual);
  await retryPage.locator('[data-action=camera-retry]').waitFor();
  assert.equal(attempts,3);
  assert.match(await retryPage.locator('.dialog').innerText(),/Kamera boleh dibuka, tetapi fail penjejakan/);
  assert.equal(await retryPage.locator('#hand-video').evaluate(video=>video.srcObject),null);
  const evidence=await retryPage.evaluate(()=>JSON.parse(localStorage.getItem('ops-iman-v1')).sessions[0].records);
  blocked=false;await retryPage.locator('[data-action=camera-retry]').click();await ready(retryPage);
  assert.equal(attempts,4);
  assert.deepEqual(await retryPage.evaluate(()=>JSON.parse(localStorage.getItem('ops-iman-v1')).sessions[0].records),evidence);
  passed('Three failed downloads release the camera; Cuba Lagi recovers without losing progress');
  await manual.close();

  const denied=await browser.newContext({serviceWorkers:'block'});
  await denied.addInitScript(()=>{navigator.mediaDevices.getUserMedia=async()=>{throw new DOMException('Permission denied for test','NotAllowedError');};});
  const deniedPage=await newGame(denied);
  await deniedPage.locator('[data-action=camera-retry]').waitFor();
  assert.match(await deniedPage.locator('.dialog').innerText(),/Kebenaran kamera belum diberikan/);
  await deniedPage.locator('.dialog [data-action=mouse]').click();
  assert.equal(await deniedPage.locator('.dialog').count(),0);
  passed('Denied camera permission has a specific message and working mouse fallback');
  await denied.close();

  const cancellation=await browser.newContext({serviceWorkers:'block'});
  const cancelPage=await cancellation.newPage();await cancelPage.goto(origin,{waitUntil:'domcontentloaded'});
  const stopped=await cancelPage.evaluate(async()=>{
   const hands=await import('./hands.js'),getMedia=navigator.mediaDevices.getUserMedia.bind(navigator.mediaDevices);
   let resolveMedia;const pending=new Promise(resolve=>{resolveMedia=resolve;});
   navigator.mediaDevices.getUserMedia=()=>pending;
   const start=hands.startHands();hands.stopHands();
   const stream=await getMedia({video:true});resolveMedia(stream);
   return {started:await start,states:stream.getTracks().map(track=>track.readyState),hidden:document.querySelector('#camera-panel').hidden};
  });
  assert.equal(stopped.started,false);assert.ok(stopped.states.every(state=>state==='ended'));assert.equal(stopped.hidden,true);
  passed('Cancelling camera startup stops a late media stream without reopening the camera');
  await cancellation.close();
 }
 assert.deepEqual(errors,[]);
 fs.writeFileSync(process.env.QA_LIVE==='1'?'artifacts/qa-camera-live.json':'artifacts/qa-camera-recovery.json',JSON.stringify({passed:true,origin,checks,errors},null,2));
}finally{await browser.close();}
