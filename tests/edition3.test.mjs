import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {ITEMS,WORD_BANK} from '../dist/content.js';
import {LEGACY_ITEMS} from '../dist/legacy-content.js';
import {migrateProgress,syncMissionProgress,stationComplete,unlockFinal,validateItem} from '../dist/missions.js';
import {certificateEligible,ensureCertificate} from '../dist/certificate.js';
import {missionPrintPages} from '../dist/mission-print.js';
const expected=[
 ['melihat','membaca','mendengar','menyapu','mengecat'],
 ['mengawal','memilih','menulis','menyusun','mengecap'],
 ['melompat','membuka','mencuci','mengambil','mengepam'],
 ['merawat','membantu','mengukur','menyimpan','mengecas'],
 ['melawat','menjaga','mengawal','menyiram','mengepos'],
 ['melihat','memilih','menulis','mengira','menyapu']
];
test('author content is exact, all six prefixes occur five times, and every item has its own scene',()=>{
 const counts={};for(let level=1;level<=6;level++)assert.deepEqual(ITEMS.filter(i=>i.level===level).map(i=>i.word),expected[level-1]);
 for(const i of ITEMS){counts[i.prefix]=(counts[i.prefix]||0)+1;validateItem(i);assert.equal(i.action,`mission-${i.level}-${i.index}`);assert.ok(fs.existsSync(`dist/assets/actions30/station-${i.level}.png`));}
 assert.deepEqual(counts,{'me-':5,'mem-':5,'men-':5,'meny-':5,'menge-':5,'meng-':5});
 assert.ok(ITEMS.filter(i=>i.level===1).every(i=>i.answer===i.prefix&&!i.hint.includes(i.word)));
});
test('intentional spelling distractors are choices only, never accepted or taught as vocabulary',()=>{
 for(const i of ITEMS.filter(i=>i.level===2))for(const wrong of i.choices.filter(c=>c!==i.word)){
  assert.ok(!i.accepted.includes(wrong));assert.ok(!i.explanation.includes(wrong));assert.ok(!WORD_BANK.some(w=>w.word===wrong));
 }
 const i=ITEMS[0];for(const choices of [[i.answer],[...i.choices.slice(0,3)],[...i.choices,'menge-'],[i.answer,i.answer,'men-','mem-']])assert.throws(()=>validateItem({...i,choices}));
});
test('four answers do not award a digit; retries and practice cannot replace the fifth task',()=>{
 const s={records:{},practice:[{id:'P1-C5',complete:true}],completedLevels:[1]};for(let n=1;n<=4;n++)s.records[`P1-C${n}`]={complete:true,attempts:5};
 syncMissionProgress(s);assert.equal(stationComplete(s,1),false);assert.equal(s.earnedCodes[0],null);
 s.records['P1-C5']={complete:true,attempts:8,hints:3};syncMissionProgress(s);assert.equal(s.earnedCodes[0],'4');assert.equal(unlockFinal(s,'427163'),false);
});
test('edition migration archives earlier evidence and certificate, and never credits changed questions',()=>{
 const old={saveVersion:2,currentId:'student',wordOverrides:{baca:{note:'Old'}},overrides:{},sessions:[{id:'student',name:'Aisyah',className:'2 A',createdAt:'2026-10-01T00:00:00Z',completedAt:'2026-10-02T00:00:00Z',records:Object.fromEntries(LEGACY_ITEMS.map(i=>[i.id,{complete:true,firstAnswer:i.answer,attempts:3,hints:2}])),finalMission:{complete:true,completedAt:'2026-10-02T00:00:00Z'},certificate:{displayName:'Nur Aisyah',teacherName:'Cikgu N',className:'2 A'},stars:24,activeMs:8000}]};
 const evidence=structuredClone(old.sessions[0].records);migrateProgress(old);assert.equal(old.sessions.length,2);
 const active=old.sessions.find(s=>s.id===old.currentId),archive=old.sessions.find(s=>s.archived);
 assert.deepEqual(active.records,{});assert.equal(certificateEligible(active),false);
 for(const [id,r] of Object.entries(evidence))for(const [key,value] of Object.entries(r))assert.deepEqual(archive.records[id][key],value);
 assert.equal(certificateEligible(archive),true);assert.equal(ensureCertificate(archive).displayName,'Nur Aisyah');assert.equal(ensureCertificate(archive).completedAt,'2026-10-02T00:00:00Z');
 const snapshot=JSON.stringify(old);migrateProgress(old);assert.equal(JSON.stringify(old),snapshot);
});
test('printed pupil activities cover all 30 IDs and preserve four spelling alternatives',()=>{
 const keys=['station-choice','station-match','station-search','station-scramble','station-blank','station-sentence'];
 keys.forEach((key,k)=>{const html=missionPrintPages(key).join('');for(let n=1;n<=5;n++)assert.ok(html.includes(`P${k+1}-C${n}`));assert.ok(!html.includes('SALINAN GURU'));});
 const match=missionPrintPages('station-match').join('');for(const i of ITEMS.filter(i=>i.level===2))for(const option of i.choices)assert.ok(match.includes(option));
 const choice=missionPrintPages('station-choice').join('');for(const i of ITEMS.filter(i=>i.level===1))assert.ok(!choice.includes(i.word));
 assert.match(missionPrintPages('answer-rubric').join(''),/SALINAN GURU/);
});
test('all required new audio uses the Malaysia voice and has a nonempty local file',()=>{
 const m=JSON.parse(fs.readFileSync('dist/audio-manifest.json','utf8'));
 for(const i of ITEMS)for(const text of [i.prompt,i.instruction,i.base,i.word,i.prefix,i.sentence,i.hint,i.explanation,...i.choices,...i.cards,...(i.pieces||[])]){
  const file=m.clips[text];assert.ok(file,text);assert.ok(fs.statSync('dist/'+file).size>500);
 }
 assert.equal(m.metadata.voice,'ms-MY-YasminNeural');assert.equal(m.failures.length,0);
});
