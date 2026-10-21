import test from 'node:test';
import assert from 'node:assert/strict';
import {STATIONS,objectLabel,STATION_MAP_VERSION} from '../dist/station-layouts.js';
import {makeMaze,routeTo,restoreStationPosition} from '../dist/engine.js';
const intersects=(a,b)=>a.x<b.x+b.width&&a.x+a.width>b.x&&a.y<b.y+b.height&&a.y+a.height>b.y;
test('six distinct routes have four ordered, reachable stops without shortcuts',()=>{
 assert.equal(new Set(STATIONS.map(s=>JSON.stringify(s.vertices))).size,6);
 for(const s of STATIONS){const m=makeMaze(s.id),solved=[];let p=m.start;
  assert.equal(new Set(s.objects.map(o=>o[0])).size,4);
  for(const point of m.points){assert.ok(routeTo(m,p,point.challenge,solved).length);assert.equal(routeTo(m,p,m.end,solved).length,0);solved.push(point.index);p=point.challenge;}
  assert.ok(routeTo(m,p,m.end,solved).length);
 }
});
test('objects and their labels stay inside the map, clear of paths and each other',()=>{
 for(const s of STATIONS){const m=makeMaze(s.id),objects=[...s.decor,...s.objects].map(o=>({name:o[0],art:{x:o[2]*50,y:o[3]*50,width:o[4]*50,height:o[5]*50},label:objectLabel(o)}));
  for(const [i,o] of objects.entries())for(const r of [o.art,o.label]){
   assert.ok(r.x>=0&&r.y>=0&&r.x+r.width<=1050&&r.y+r.height<=850,`${s.id}: ${o.name} inside map`);
   for(const p of m.path)assert.equal(intersects(r,{x:p.x*50,y:p.y*50,width:50,height:50}),false,`${s.id}: ${o.name} overlaps path ${p.x},${p.y}`);
   for(const other of objects.slice(i+1))for(const b of [other.art,other.label])assert.equal(intersects(r,b),false,`${s.id}: ${o.name} overlaps ${other.name}`);
  }
 }
});
test('old saves move to a safe reachable point while evidence, rewards and certificates remain intact',()=>{
 for(let level=1;level<=6;level++)for(let complete=0;complete<=4;complete++){
  const s={level,positions:{[level]:{x:7,y:4}},records:{},stars:19,codeDigits:['0','2','7','1','6','3'],certificate:{displayName:'Aisyah'},teacher:{notes:'Kekalkan'}};
  for(let i=1;i<=complete;i++)s.records[`P${level}-C${i}`]={complete:true,attempts:3,hints:2};
  const evidence=structuredClone({records:s.records,stars:s.stars,code:s.codeDigits,certificate:s.certificate,teacher:s.teacher});
  const m=makeMaze(level),p=restoreStationPosition(s,m),solved=Array.from({length:complete},(_,i)=>i);
  assert.ok(routeTo(m,m.start,p,solved).length);assert.equal(s.stationMapVersions[level],STATION_MAP_VERSION);assert.deepEqual(s.legacyPositions[level],{x:7,y:4});
  assert.deepEqual({records:s.records,stars:s.stars,code:s.codeDigits,certificate:s.certificate,teacher:s.teacher},evidence);
  assert.deepEqual(restoreStationPosition(s,m),p);
 }
});
