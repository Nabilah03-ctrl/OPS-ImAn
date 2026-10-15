import test from 'node:test';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {ITEMS,WORD_BANK,ENRICHMENT,CURRICULUM} from '../dist/content.js';
import {makeMaze,routeTo,canMove} from '../dist/engine.js';
import {missionStatus,avatarArt} from '../dist/visuals.js';
test('visual upgrade preserves curriculum and every learning item',()=>{
 assert.equal(createHash('sha256').update(JSON.stringify({ITEMS,WORD_BANK,ENRICHMENT,CURRICULUM})).digest('hex'),'08c0bcfdb5936c8959f28e6f28f85e6e7e7eac3262b0564faa0f4a0d386be870');
});
test('new intersections never bypass a challenge and old route coordinates remain walkable',()=>{
 for(const easy of [false,true])for(let level=1;level<=6;level++){
  const m=makeMaze(level,easy),solved=[];
  for(let n=0;n<4;n++){
   assert.ok(routeTo(m,m.start,m.points[n].challenge,solved).length);
   for(let later=n+1;later<4;later++)assert.equal(routeTo(m,m.start,m.points[later].challenge,solved).length,0,`L${level} gate ${n} must block clue ${later}`);
   assert.equal(routeTo(m,m.start,m.end,solved).length,0);
   solved.push(n);
  }
  for(const p of m.path)assert.ok(canMove(m,p.x,p.y,solved));
 }
});
test('four assisted completions unlock the next mission before walking to the exit',()=>{
 const s={level:1,records:{},completedLevels:[]};
 assert.equal(missionStatus(s,1).state,'current');assert.equal(missionStatus(s,2).state,'locked');
 for(let i=1;i<=4;i++)s.records[`P1-C${i}`]={level:1,complete:true,attempts:3,hints:2};
 assert.equal(missionStatus(s,1).state,'done');assert.equal(missionStatus(s,2).state,'available');assert.equal(missionStatus(s,3).state,'locked');
 s.level=5;assert.equal(missionStatus(s,5).state,'current');assert.equal(missionStatus(s,4).state,'available');
 assert.match(avatarArt('hijab'),/police-hijab\.png$/);assert.match(avatarArt('boy'),/police-boy\.png$/);
});
