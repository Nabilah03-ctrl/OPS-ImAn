import test from 'node:test';
import assert from 'node:assert/strict';
import {ITEMS} from '../dist/content.js';
import {orderedChoices,newActivity,validateItem,orderedIndices,activityCorrect} from '../dist/missions.js';
import {activityView} from '../dist/activities.js';

test('correct choices can occupy every position without changing the accepted answer',()=>{
 for(const item of ITEMS.filter(i=>['choice','match','blank'].includes(i.type))){
  const positions=new Set();for(const random of [()=>0,()=>.26,()=>.4,()=>.999]){const order=orderedChoices(item,{},random);positions.add(order.indexOf(item.answer));assert.equal(order.length,4);assert.equal(new Set(order).size,4);assert.ok(order.includes(item.answer));}
  assert.deepEqual([...positions].sort(),[0,1,2,3]);
 }
});
test('choices stay fixed on retry, help and reload; guidance keeps exactly four',()=>{
 for(const item of ITEMS.filter(i=>['choice','match','blank'].includes(i.type))){
  const state=newActivity(item),order=[...orderedChoices(item,state,()=>0)];
  for(const options of [{},{two:true},{guidance:true}]){const html=activityView(item,state,options),attribute=item.type==='choice'?'data-answer=':'data-value=';assert.equal(html.split(attribute).length-1,4);assert.deepEqual(state.choiceOrder,order);}
  const restored=JSON.parse(JSON.stringify(state));assert.deepEqual(orderedChoices(item,restored,()=>{throw Error('Must not reshuffle saved choices');}),order);
 }
});
test('legacy two-choice records are expanded without losing their selected answer',()=>{
 const item={...ITEMS[0],choices:['baca','membaca']},state={selection:'baca',choiceOrder:['membaca','baca']};
 assert.equal(orderedChoices(item,state).length,4);assert.equal(state.selection,'baca');
 assert.throws(()=>validateItem(item),/empat/);assert.throws(()=>validateItem({...item,choices:['membaca','baca','baca']}),/berbeza/);
 validateItem({...item,choices:['me-','mem-','men-','menge-']});
});
test('shuffled card banks preserve identity, saved positions and answer checking',()=>{
 for(const item of ITEMS.filter(i=>['scramble','sentence'].includes(i.type))){
  const state=newActivity(item),key=item.type==='scramble'?'pieceOrder':'cardOrder',values=item.type==='scramble'?item.pieces:item.cards;
  const order=[...orderedIndices(values,state,key)];assert.deepEqual([...order].sort((a,b)=>a-b),values.map((_,i)=>i));assert.deepEqual(orderedIndices(values,JSON.parse(JSON.stringify(state)),key),order);
  if(item.type==='scramble')state.tokens=[0,1,2];else state.slots=item.parts.map(word=>item.cards.indexOf(word));
  assert.ok(activityCorrect(item,state));
 }
});
