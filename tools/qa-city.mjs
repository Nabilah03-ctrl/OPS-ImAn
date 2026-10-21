import {chromium} from 'playwright-core';
import fs from 'node:fs';
import assert from 'node:assert/strict';
import {makeMaze} from '../dist/engine.js';
const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
const errors=[],failed=[],checks=[];
try{
 const context=await browser.newContext({viewport:{width:1440,height:1050},serviceWorkers:'block'}),p=await context.newPage();
 p.on('pageerror',e=>errors.push(e.message));p.on('response',r=>{if(r.status()>=400)failed.push({url:r.url(),status:r.status()});});
 const click=action=>p.locator(`[data-action=${action}]`).first().click();
 const fits=async()=>assert.ok(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'No horizontal page overflow');
 const imagesReady=async()=>{await p.evaluate(async()=>{await document.fonts.ready;for(const i of document.images)i.loading='eager';await Promise.all([...document.images].map(i=>i.decode().catch(()=>{})));});assert.deepEqual(await p.evaluate(()=>[...document.images].filter(i=>!i.naturalWidth).map(i=>i.src)),[]);};
 await p.goto('http://127.0.0.1:4173');await p.locator('h1').waitFor();await imagesReady();await fits();await p.screenshot({path:'artifacts/city-home-desktop.png',fullPage:true});
 await p.setViewportSize({width:390,height:844});await fits();await p.screenshot({path:'artifacts/city-home-mobile.png',fullPage:true});
 await click('new');assert.equal(await p.locator('[name=avatar]').count(),3);await p.locator('#student-name').fill('Nur Aisyah');await p.locator('#student-class').fill('2 Bestari');await p.locator('[name=avatar][value=hijab]').check();await p.locator('#setup-form [type=submit]').click();await click('close');await imagesReady();await fits();
 assert.equal(await p.locator('.city-location').count(),6);assert.equal(await p.locator('.city-location:disabled').count(),5);await p.screenshot({path:'artifacts/city-map-mobile.png',fullPage:true});
 await p.emulateMedia({reducedMotion:'reduce'});assert.equal(await p.locator('.city-patrol').evaluate(el=>getComputedStyle(el).animationName),'none');assert.equal(await p.locator('.helicopter-rotor').evaluate(el=>getComputedStyle(el).animationName),'none');await p.emulateMedia({reducedMotion:'no-preference'});
 await p.setViewportSize({width:768,height:1024});await fits();await p.screenshot({path:'artifacts/city-map-tablet.png',fullPage:true});
 await p.setViewportSize({width:1440,height:1050});await fits();await p.screenshot({path:'artifacts/city-map-desktop.png',fullPage:true});
 await p.reload();await click('resume');await p.locator('#maze').waitFor();await click('maze-camera');assert.equal(await p.locator('.maze-minimap').count(),1);await p.setViewportSize({width:390,height:844});await fits();await p.screenshot({path:'artifacts/city-maze-mobile.png',fullPage:true});
 await click('city-guide');assert.ok(await p.locator('.city-guide-art').isVisible());await imagesReady();await click('close');
 await p.locator('.station-stop[data-index="0"]').focus();await p.keyboard.press('Enter');await p.locator('.question-text').waitFor();await imagesReady();await fits();await p.screenshot({path:'artifacts/city-question-mobile.png',fullPage:true});await p.locator('[data-action=answer][data-answer=membaca]').click();await click('question-next');
 const saved=await p.evaluate(()=>JSON.parse(localStorage.getItem('ops-iman-v1')));const s=saved.sessions[0];assert.equal(s.avatar,'hijab');assert.equal(s.records['P1-C1'].complete,true);
 // Existing progress can resume at a later-stage coordinate, with the previous avatars.
 s.avatar='girl';s.level=5;s.positions[5]=makeMaze(5).start;s.completedLevels=[1,2,3,4];
 await p.addInitScript(d=>{if(!sessionStorage.getItem('city-fixture')){localStorage.setItem('ops-iman-v1',JSON.stringify(d));sessionStorage.setItem('city-fixture','1');}},saved);await p.reload();await click('resume');assert.equal(await p.locator('#maze').getAttribute('data-x'),String(s.positions[5].x));assert.ok((await p.locator('.player image').getAttribute('href')).endsWith('police-girl.png'));const cropped=await p.locator('#maze').getAttribute('viewBox');await click('maze-camera');assert.notEqual(await p.locator('#maze').getAttribute('viewBox'),cropped);assert.equal(await p.locator('.maze-minimap').count(),0);
 const reloaded=await p.evaluate(()=>JSON.parse(localStorage.getItem('ops-iman-v1')));assert.deepEqual(reloaded.sessions[0].records,s.records);assert.equal(reloaded.sessions[0].stars,s.stars);
 await p.setViewportSize({width:1440,height:1050});await p.screenshot({path:'artifacts/city-maze-later.png',fullPage:true});await click('library');await imagesReady();await p.locator('.equipment-collection summary').click();await imagesReady();await p.screenshot({path:'artifacts/city-library.png',fullPage:true});
 checks.push('home/map/maze/question at 390, 768 and 1440 pixels','3 avatars and saved-session compatibility','6 named buildings and locked statuses','camera view and minimap','guide illustration','reduced motion','PNG assets decode','learning evidence retained');
 assert.deepEqual(errors,[]);assert.deepEqual(failed,[]);fs.writeFileSync('artifacts/qa-city.json',JSON.stringify({passed:true,checks,errors,failed},null,2));console.log(JSON.stringify({passed:true,checks}));
}finally{await browser.close();}
