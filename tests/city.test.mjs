import test from 'node:test';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {ITEMS,WORD_BANK,ENRICHMENT,CURRICULUM} from '../dist/content.js';
import {makeMaze,routeTo,canMove} from '../dist/engine.js';
import {missionStatus,avatarArt} from '../dist/visuals.js';
test('mission upgrade preserves curriculum and the city has 30 tasks',()=>{assert.equal(ITEMS.length,30);assert.match(CURRICULUM.sp,/\(iii\)/);assert.ok(WORD_BANK.some(w=>w.word==='menyapu'));assert.equal(ENRICHMENT.length,3);});
test('station routes never bypass a challenge and every route coordinate remains walkable',()=>{
 for(const easy of [false,true])for(let level=1;level<=6;level++){
  const m=makeMaze(level,easy),solved=[];
  for(let n=0;n<5;n++){
   assert.ok(routeTo(m,m.start,m.points[n].challenge,solved).length);
   for(let later=n+1;later<5;later++)assert.equal(routeTo(m,m.start,m.points[later].challenge,solved).length,0,`L${level} gate ${n} must block clue ${later}`);
   assert.equal(routeTo(m,m.start,m.end,solved).length,0);
   solved.push(n);
  }
  for(const p of m.path)assert.ok(canMove(m,p.x,p.y,solved));
 }
});
test('all six stations open immediately and five assisted completions earn a badge',()=>{
 const s={level:1,records:{},completedLevels:[]};
 assert.equal(missionStatus(s,1).state,'current');assert.equal(missionStatus(s,2).state,'available');
 for(let i=1;i<=5;i++)s.records[`P1-C${i}`]={level:1,complete:true,attempts:3,hints:2};
 assert.equal(missionStatus(s,1).state,'done');assert.equal(missionStatus(s,2).state,'available');assert.equal(missionStatus(s,3).state,'available');
 s.level=5;assert.equal(missionStatus(s,5).state,'current');assert.equal(missionStatus(s,4).state,'available');
 assert.match(avatarArt('hijab'),/police-hijab\.png$/);assert.match(avatarArt('boy'),/police-boy\.png$/);
});
