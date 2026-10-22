import {chromium} from 'playwright-core';
import fs from 'node:fs';
import assert from 'node:assert/strict';
import {ITEMS} from '../dist/content.js';
import {makeMaze,routeTo} from '../dist/engine.js';
import {makeWordSearch} from '../dist/missions.js';
const origin=process.env.QA_ORIGIN||'http://127.0.0.1:4189';
const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
const context=await browser.newContext({viewport:{width:1360,height:1040},serviceWorkers:'block',reducedMotion:'reduce'}),page=await context.newPage(),errors=[];
page.on('pageerror',error=>errors.push(error.message));
const state=()=>page.evaluate(()=>{const data=JSON.parse(localStorage.getItem('ops-iman-v1'));return data.sessions.find(s=>s.id===data.currentId);});
const record=async id=>(await state()).records[id];
async function drag(from,to){
 await from.scrollIntoViewIfNeeded();const a=await from.boundingBox(),b=await to.boundingBox();assert.ok(a&&b);await page.mouse.move(a.x+a.width/2,a.y+a.height/2);await page.mouse.down();await page.mouse.move(b.x+b.width/2,b.y+b.height/2,{steps:12});await page.mouse.up();await page.waitForTimeout(470);
}
try{
 await page.goto(origin);await page.locator('[data-action=new]').click();await page.locator('#student-name').fill('Ujian Enam Stesen');await page.locator('#student-class').fill('2 Bestari');await page.locator('#control').selectOption('keyboard');await page.locator('#setup-form [type=submit]').click();await page.locator('[data-action=close]').click();assert.equal(await page.locator('.city-location:not([disabled])').count(),6);
 let completedStations=0;
 for(const level of [6,2,4,1,5,3]){
  await page.locator(`[data-action=level][data-level="${level}"]`).click();if(completedStations===0)await page.locator('[data-action=toggle-audio]').click();
  const maze=makeMaze(level),solved=[];let pos=maze.start;
  const walk=async target=>{const route=routeTo(maze,pos,target,solved);assert.ok(route.length);for(const next of route.slice(1)){const key=next.x>pos.x?'ArrowRight':next.x<pos.x?'ArrowLeft':next.y>pos.y?'ArrowDown':'ArrowUp';await page.waitForTimeout(145);await page.keyboard.press(key);pos=next;}};
  for(let index=1;index<=5;index++){
   const item=ITEMS.find(i=>i.level===level&&i.index===index);await walk(maze.points[index-1].challenge);await page.locator('.question-text').waitFor();
   const act=(action)=>page.locator(`[data-action="activity-${action}"]`);
   if(item.type==='choice'){
    assert.equal(await page.locator('[data-action=answer]').count(),4);assert.ok(!(await page.locator('.dialog').innerText()).includes(item.word));if(index===1){await page.locator('[data-answer=mem-]').click();assert.ok(await page.locator('.feedback.wrong').isVisible());await page.locator('[data-power=double]').click();}
    await page.locator(`[data-answer="${item.answer}"]`).click();
   }
   if(item.type==='match'){
    assert.equal(await act('match-b').count(),4);
    if(index===1){await page.locator(`[data-action=activity-match-b][data-value="${item.choices.find(w=>w!==item.answer)}"]`).click();await act('match-target').click();assert.equal((await record(item.id)).attempts,0);await act('submit').click();assert.ok(await page.locator('.feedback.wrong').isVisible());}
    if(index===2)await drag(page.locator(`[data-action=activity-match-b][data-value="${item.answer}"]`),act('match-target'));else{await page.locator(`[data-action=activity-match-b][data-value="${item.answer}"]`).click();await act('match-target').click();}await act('submit').click();
   }
   if(item.type==='search'){
    const size=makeWordSearch(item).grid.length,cells=makeWordSearch(item).cells,a=cells[0],b=cells.at(-1),from=page.locator(`[data-cell="${a.y*size+a.x}"]`),to=page.locator(`[data-cell="${b.y*size+b.x}"]`);
    if(index===1){await page.locator('[data-cell="0"]').click();await page.locator('[data-cell="7"]').click();await act('submit').click();assert.ok(await page.locator('.feedback.wrong').isVisible());await act('reset').click();await drag(from,to);}
    else{await from.click();await to.click();}
    if(index===4){await page.setViewportSize({width:390,height:844});assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));await page.screenshot({path:'artifacts/missions-mobile-search.png',fullPage:true});await page.setViewportSize({width:1360,height:1040});}
    assert.equal((await record(item.id)).complete,false);await act('submit').click();
   }
   if(item.type==='scramble'){
    if(index===1){await page.locator('[data-action=activity-piece][data-index="0"]').click();await act('submit').click();assert.ok(await page.locator('.feedback.wrong').isVisible());await act('reset').click();await page.locator('[data-power=hint]').click();assert.equal((await record(item.id)).activity.tokens.length,1);
     await page.locator('.dialog [data-action=pause]').click();const elapsed=(await state()).activeMs;await page.waitForTimeout(1000);await page.locator('[data-action=resume-pause]').click();assert.ok((await state()).activeMs-elapsed<500);
     const savedTokens=(await record(item.id)).activity.tokens;await page.reload();await page.locator('[data-action=resume]').click();await page.locator('.question-text').waitFor();assert.deepEqual((await record(item.id)).activity.tokens,savedTokens);
    }
    const correct=[0,1,2];for(const token of correct){if(!(await record(item.id)).activity.tokens.includes(token))await page.locator(`[data-action=activity-piece][data-index="${token}"]`).click();}
    assert.equal((await record(item.id)).complete,false);await act('submit').click();
   }
   if(item.type==='blank'){
    assert.ok(await act('blank-word').first().isDisabled());await act('blank-slot').click();await page.locator(`[data-action=activity-blank-word][data-value="${item.answer}"]`).click();assert.equal((await record(item.id)).attempts,0);await act('submit').click();
   }
   if(item.type==='sentence'){
    for(const [slot,word] of item.parts.entries()){
     const card=item.cards.indexOf(word);if(index===1&&slot===0)await drag(page.locator(`[data-action=activity-card][data-index="${card}"]`),page.locator(`[data-slot="${slot}"]`));
     else{await page.locator(`[data-action=activity-card][data-index="${card}"]`).click();await page.locator(`[data-slot="${slot}"]`).click();}
    }
    assert.equal((await record(item.id)).attempts,0);
    await act('submit').click();
   }
   assert.ok(await page.locator('.feedback.correct').isVisible(),item.id);assert.equal((await record(item.id)).complete,true);
   if(index===1)await page.screenshot({path:`artifacts/missions-station-${level}.png`,fullPage:true});
   await page.locator('[data-action=question-next]').click();solved.push(index-1);
  }
  completedStations++;assert.equal((await state()).earnedCodes.filter(d=>d!=null).length,completedStations);
  console.log(`Station ${level}: five challenges and digit verified.`);
  if(completedStations<6)await page.locator('.dialog [data-action=map]').click();else await page.locator('.dialog [data-action=final]').click();
 }
 let completed=await state();assert.equal(Object.values(completed.records).filter(r=>r.complete).length,30);assert.equal(completed.finalMission.complete,false);assert.equal(completed.certificate,null);
 await page.locator('[data-action=code-digit][data-digit="0"]').click();await page.locator('[data-action=code-open]').click();assert.ok(await page.locator('.feedback.wrong').isVisible());assert.equal((await state()).finalMission.draft[0],'0');assert.deepEqual((await state()).records,completed.records);
 const oldDigits=completed.codeDigits;await page.reload();await page.locator('[data-action=map]').click();await page.locator('[data-action=final]').click();assert.deepEqual((await state()).codeDigits,oldDigits);assert.equal((await state()).finalMission.draft[0],'0');
 await page.locator('[data-action=codes]').last().click();assert.equal(await page.locator('.dialog .code-card strong').count(),6);await page.locator('[data-action=codes-back]').click();
 await page.locator('[data-action=code-clear]').click();for(const digit of oldDigits)await page.locator(`[data-action=code-digit][data-digit="${digit}"]`).click();await page.locator('[data-action=code-open]').click();await page.locator('.completion-title').waitFor();assert.equal((await state()).finalMission.complete,true);
 await page.locator('.dialog [data-action=certificate-view]').click();assert.match(await page.locator('#certificate-preview').textContent(),/6 daripada 6 stesen selesai/);
 const downloadPromise=page.waitForEvent('download');await page.locator('[data-action=certificate-download]').click();const download=await downloadPromise;assert.equal(download.suggestedFilename(),'Sijil_OPS_ImAn_Ujian_Enam_Stesen.pdf');await download.saveAs('artifacts/missions-certificate.pdf');assert.ok(fs.statSync('artifacts/missions-certificate.pdf').size>10000);
 await page.screenshot({path:'artifacts/missions-certificate.png',fullPage:true});
 completed=await state();const stars=completed.stars;await page.locator('.dialog [data-action=home]').click();await page.locator('[data-action=teacher]').click();await page.locator('[data-action=record]').first().click();assert.match(await page.locator('.card.record-detail').innerText(),/Status Peti Kejayaan: Dibuka/);await page.locator('.record-detail [data-action=certificate-view]').click();assert.ok(await page.locator('#certificate-preview').isVisible());assert.equal((await state()).stars,stars);
 await page.locator('[data-action=close]').click();await page.locator('[data-action=print]').click();await page.locator('#print-session').selectOption(completed.id);
 const codeDownload=page.waitForEvent('download');await page.locator('[data-action=print-session-codes]').click();await(await codeDownload).saveAs('artifacts/missions-code-cards.pdf');
 assert.deepEqual(errors,[]);const report={passed:true,records:30,stations:6,types:[...new Set(Object.values(completed.records).map(r=>r.gameType))],codes:completed.codeDigits,stars,finalMission:completed.finalMission.status,certificateDownload:true,sessionCodeDownload:true,errors};fs.writeFileSync('artifacts/qa-missions.json',JSON.stringify(report,null,2));console.log(JSON.stringify(report));
}catch(error){await page.screenshot({path:'artifacts/missions-failure.png',fullPage:true}).catch(()=>{});fs.writeFileSync('artifacts/missions-failure.json',JSON.stringify({message:error.message,errors,session:await state().catch(()=>null)},null,2));throw error;}finally{await browser.close();}
