import test from 'node:test';
import assert from 'node:assert/strict';
import {ITEMS} from '../dist/content.js';
import {GAME_TYPES,makeWordSearch,wordPaths,selectedCells,newActivity,activityCorrect,placeCard,applyActivityHint,migrateProgress,syncMissionProgress,unlockFinal,allStationsComplete} from '../dist/missions.js';
import {certificateEligible,ensureCertificate} from '../dist/certificate.js';
import {missionPrintPages} from '../dist/mission-print.js';

test('30 tasks use six different mechanics and balance six prefix forms across five tasks per station',()=>{
 assert.equal(ITEMS.length,30);
 for(let level=1;level<=6;level++){
  const items=ITEMS.filter(i=>i.level===level);assert.equal(items.length,5);
  assert.ok(items.every(i=>i.type===GAME_TYPES[level-1]));
  assert.equal(new Set(items.map(i=>i.id)).size,5);
 }
});
test('word grids contain exactly one forward target and reject reverse/diagonal selections',()=>{
 for(const item of ITEMS.filter(i=>i.type==='search')){
  const a=makeWordSearch(item);assert.deepEqual(a,makeWordSearch(item));
  assert.equal(a.grid.length,Math.max(8,item.answer.length));assert.ok(a.grid.every(r=>r.length===a.grid.length));
  assert.equal(wordPaths(a.grid,item.answer).length,1);
  const state=newActivity(item),start=a.cells[0],end=a.cells.at(-1);state.start=start.y*a.grid.length+start.x;state.end=end.y*a.grid.length+end.x;
  assert.equal(activityCorrect(item,state),true);[state.start,state.end]=[state.end,state.start];assert.equal(activityCorrect(item,state),false);
 }
 assert.deepEqual(selectedCells(0,9),[]);
});
test('scramble hints give only the first piece and every set can form its word',()=>{
 for(const item of ITEMS.filter(i=>i.type==='scramble')){
  const state=newActivity(item);applyActivityHint(item,state);assert.equal(state.tokens.length,1);assert.equal(activityCorrect(item,state),false);
  const combinations=[[0,1,2],[0,2,1],[1,0,2],[1,2,0],[2,0,1],[2,1,0]];
  assert.equal(combinations.filter(tokens=>activityCorrect(item,{...state,tokens})).length,1);
 }
});
test('sentence swaps preserve unique cards and a distractor is never accepted',()=>{
 const item=ITEMS.find(i=>i.id==='P6-C4'),state=newActivity(item);
 item.parts.forEach((word,index)=>placeCard(state,item.cards.indexOf(word),index));assert.equal(activityCorrect(item,state),true);
 placeCard(state,item.cards.indexOf('kon'),1);assert.equal(activityCorrect(item,state),false);
 placeCard(state,item.cards.indexOf('polis'),1);placeCard(state,item.cards.indexOf('Anggota'),2);
 assert.equal(new Set(state.slots).size,state.slots.length);assert.equal(activityCorrect(item,state),false);
 placeCard(state,item.cards.indexOf('Anggota'),0);assert.equal(activityCorrect(item,state),true);
 const blank=ITEMS.find(i=>i.id==='P5-C1');assert.equal(activityCorrect(blank,{typing:true,draft:'  MELAWAT   '}),true);
});
test('migration preserves old evidence and certificates while awarding completed station codes once',()=>{
 const record={complete:true,firstAnswer:'baca',attempts:3,hints:2,review:{notes:'Kekalkan bukti'}};
 const old={settings:{},overrides:{'P1-C1':{prompt:'Nota guru'}},sessions:[{name:'Murid Lama',records:Object.fromEntries([1,2,3,4].map(n=>[`P1-C${n}`,structuredClone(record)])),completedLevels:[],activeMs:8000,certificate:{displayName:'Nama disemak'}}]};
 migrateProgress(old);const session=old.sessions.find(s=>s.archived);assert.deepEqual(old.sessions[0].records,{});
 assert.equal(session.records['P1-C1'].firstAnswer,'baca');assert.equal(session.records['P1-C1'].review.notes,'Kekalkan bukti');assert.equal(session.certificate.displayName,'Nama disemak');
 assert.deepEqual(session.earnedCodes,['4',null,null,null,null,null]);assert.equal(old.legacyOverrides['P1-C1'].prompt,'Nota guru');assert.equal(old.saveVersion,3);
 const snapshot=JSON.stringify(old);migrateProgress(old);assert.equal(JSON.stringify(old),snapshot);assert.equal(certificateEligible(session),false);
});
test('final code requires all 30 records, preserves leading zero and never penalizes a retry',()=>{
 const session={name:'Ujian',className:'2 A',records:{},activeMs:7000,codeDigits:['0','2','7','1','6','3']};
 syncMissionProgress(session);assert.equal(unlockFinal(session,'027163'),false);
 for(const item of ITEMS)session.records[item.id]={complete:true,attempts:5,hints:3};
 syncMissionProgress(session);assert.equal(allStationsComplete(session),true);assert.equal(certificateEligible(session),false);
 const before=JSON.stringify(session.records);assert.equal(unlockFinal(session,'27163'),false);assert.equal(unlockFinal(session,'000000'),false);assert.equal(JSON.stringify(session.records),before);
 assert.equal(unlockFinal(session,'027163','2026-10-20T00:00:00Z'),true);assert.equal(certificateEligible(session),true);
 const cert=ensureCertificate(session);assert.equal(cert.activeMs,7000);assert.equal(cert.completedAt,'2026-10-20T00:00:00Z');
 session.activeMs=9999;unlockFinal(session,'027163','2027-01-01T00:00:00Z');assert.equal(ensureCertificate(session).activeMs,7000);assert.equal(session.completedAt,'2026-10-20T00:00:00Z');
 const reload=JSON.parse(JSON.stringify(session));syncMissionProgress(reload);assert.deepEqual(reload.codeDigits,['0','2','7','1','6','3']);
 const printed=missionPrintPages('mission-codes',{session:reload}).join('');assert.match(printed,/<strong>0<\/strong>/);assert.doesNotMatch(printed,/427163/);
});
