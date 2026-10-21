import {chromium} from 'playwright-core';
import fs from 'node:fs';
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {makeMaze,restoreStationPosition} from '../dist/engine.js';
import {STATION_MAP_VERSION} from '../dist/station-layouts.js';
const origin=process.env.QA_ORIGIN||'http://127.0.0.1:4189';
const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
const errors=[],failed=[],checks=[];
const contextOptions={serviceWorkers:'block',reducedMotion:'reduce'};
const fits=async p=>assert.ok(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'No horizontal overflow');
const ready=async p=>{await p.evaluate(async()=>{await document.fonts.ready;await Promise.all([...document.images].map(i=>i.decode().catch(()=>{})));});await p.waitForTimeout(300);};
function watch(p){p.on('pageerror',e=>errors.push(e.message));p.on('response',r=>{if(r.status()>=400)failed.push({url:r.url(),status:r.status()});});}
try{
 const p=await browser.newPage({...contextOptions,viewport:{width:1440,height:1100}});watch(p);
 await p.goto(origin+'/station-preview.html');await ready(p);assert.equal(await p.locator('.station-preview-card').count(),6);await fits(p);
 for(let level=1;level<=6;level++)await p.locator('#stesen-'+level).screenshot({path:`artifacts/station-preview-${level}.png`});
 await p.screenshot({path:'artifacts/station-preview-all.png',fullPage:true});
 await p.setViewportSize({width:768,height:1024});await fits(p);await p.screenshot({path:'artifacts/station-preview-tablet.png',fullPage:true});
 await p.goto(origin);await p.locator('[data-action=new]').click();await p.locator('#student-name').fill('Ujian Peta Stesen');await p.locator('#student-class').fill('2 Bestari');await p.locator('#control').selectOption('keyboard');await p.locator('#setup-form [type=submit]').click();await p.locator('[data-action=close]').click();
 const fixture=await p.evaluate(()=>JSON.parse(localStorage.getItem('ops-iman-v1')));
 await p.locator('[data-action=level][data-level="1"]').click();
 const before=await p.locator('#maze').getAttribute('data-y');
 await p.locator('.station-stop[data-index="3"]').click();assert.equal(await p.locator('#maze').getAttribute('data-y'),before);assert.equal(await p.locator('.question-text').count(),0);
 await p.locator('.station-stop[data-index="0"]').focus();await p.keyboard.press('Enter');await p.locator('.question-text').waitFor();assert.equal(await p.locator('.station-question').getAttribute('data-scene'),'1-1');
 checks.push('Keyboard activates a map stop; locked stops cannot bypass gates');
 await p.close();
 for(let level=1;level<=6;level++){
  const d=structuredClone(fixture),s=d.sessions[0],m=makeMaze(level);s.level=level;s.audio=false;s.records={};s.stationMapVersions={[level]:STATION_MAP_VERSION};
  const at=m.path.findIndex(point=>point===m.points[0].challenge);s.positions={[level]:m.path[Math.max(0,at-2)]};
  const context=await browser.newContext({...contextOptions,viewport:{width:390,height:844},isMobile:true,hasTouch:true});
  await context.addInitScript(d=>{if(!sessionStorage.getItem('station-seeded')){localStorage.setItem('ops-iman-v1',JSON.stringify(d));sessionStorage.setItem('station-seeded','1');}},d);
  const mobile=await context.newPage();watch(mobile);await mobile.goto(origin);await mobile.locator('[data-action=resume]').click();await ready(mobile);await fits(mobile);
  assert.equal(await mobile.locator('#maze').getAttribute('data-station'),String(level));assert.equal(await mobile.locator('.maze-minimap').count(),1);
  const circle=mobile.locator('.station-stop[data-index="0"]'),bounds=await circle.boundingBox();assert.ok(bounds.width>=44&&bounds.height>=44,'Touch target at least 44 pixels');
  const aspect=await mobile.locator('#maze').evaluate(el=>{const r=el.getBoundingClientRect();return r.width/r.height;});assert.ok(Math.abs(aspect-1)<.01);
  await mobile.screenshot({path:`artifacts/station-mobile-${level}.png`,fullPage:true});
  await circle.tap();await mobile.locator('.question-text').waitFor();await ready(mobile);await fits(mobile);assert.equal(await mobile.locator('.station-question').getAttribute('data-scene'),`${level}-1`);
  await mobile.screenshot({path:`artifacts/station-question-mobile-${level}.png`,fullPage:true});await context.close();
 }
 checks.push('Six mobile follow-camera maps with 44-pixel targets, correct aspect ratio and working tap navigation');
 const d=structuredClone(fixture),s=d.sessions[0];s.level=4;s.positions={4:{x:7,y:4}};s.records={'P4-C1':{level:4,complete:true,attempts:3,hints:2},'P4-C2':{level:4,complete:true,attempts:2,hints:1}};s.stars=17;s.teacher.notes='Catatan lama';
 const expected=structuredClone(s);restoreStationPosition(expected);const legacy=await browser.newContext(contextOptions);
 await legacy.addInitScript(d=>localStorage.setItem('ops-iman-v1',JSON.stringify(d)),d);const old=await legacy.newPage();watch(old);await old.goto(origin);await old.locator('[data-action=resume]').click();
 const saved=await old.evaluate(()=>JSON.parse(localStorage.getItem('ops-iman-v1')).sessions[0]);assert.deepEqual(saved.positions[4],expected.positions[4]);assert.equal(saved.stars,17);assert.equal(saved.teacher.notes,'Catatan lama');for(const [id,record] of Object.entries(s.records))for(const [key,value] of Object.entries(record))assert.deepEqual(saved.records[id][key],value);await legacy.close();
 checks.push('Legacy coordinates migrate safely while answers, assistance, stars and teacher notes are preserved');
 if(!process.env.QA_ORIGIN){
  const git='C:/Users/user/AppData/Local/GitHubDesktop/app-3.6.7/resources/app/git/cmd/git.exe';
  const repo=fs.existsSync('artifacts/github-deploy-ops-iman/.git')?'artifacts/github-deploy-ops-iman':'.';
  const previous=execFileSync(git,['-C',repo,'show','4c51952:dist/visuals.js'],{encoding:'utf8'});
  const current=fs.readFileSync('dist/visuals.js','utf8');assert.equal(current.split('export function cityMap')[1].split('export const roadMaze')[0].trim(),previous.split('export function cityMap')[1].split('const adjacent=')[0].trim());
  assert.equal(fs.readFileSync('dist/content.js','utf8').replaceAll('\r\n','\n'),execFileSync(git,['-C',repo,'show','4c51952:dist/content.js'],{encoding:'utf8'}).replaceAll('\r\n','\n'));
  checks.push('Main mission map and all original questions/answers are unchanged');
 }
 assert.deepEqual(errors,[]);assert.deepEqual(failed,[]);
 const report={passed:true,checks,errors,failed};fs.writeFileSync('artifacts/qa-stations.json',JSON.stringify(report,null,2));console.log(JSON.stringify(report));
}finally{await browser.close();}
