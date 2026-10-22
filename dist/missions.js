// Shared rules for the six activities, saved progress and the final code.
import {STATION_CONTENT,CONTENT_VERSION} from './edition-content.js';
export const SAVE_VERSION = 3;
export const DEFAULT_CODE = ['4','2','7','1','6','3'];
export const GAME_TYPES = ['choice','match','search','scramble','blank','sentence'];
export const GAME_NAMES = ['Pilih Imbuhan Awalan','Padankan A dengan B','Cari Perkataan','Susun Perkataan','Isi Tempat Kosong','Bina Ayat'];
export const MISSION_NAMES = ['Kenali Tugas Polis','Padankan Petunjuk','Jejak Kata','Susun Kod Kata','Lengkapkan Laporan','Laporan Akhir Polis'];
export const CORE_WORDS = [
 {base:'baca',word:'membaca',prefix:'mem-',action:'reading',object:'buku nota.',pieces:['ca','mem','ba'],parts:['Anggota polis','membaca','buku nota.']},
 {base:'bantu',word:'membantu',prefix:'mem-',action:'helping',object:'warga emas.',pieces:['tu','mem','ban'],parts:['Anggota polis','membantu','warga emas.']},
 {base:'cari',word:'mencari',prefix:'men-',action:'searching',object:'beg yang tercicir.',pieces:['ri','men','ca'],parts:['Anggota polis','mencari','beg','yang tercicir.']},
 {base:'kawal',word:'mengawal',prefix:'meng-',action:'traffic',object:'lalu lintas.',pieces:['wal','me','nga'],parts:['Anggota polis','mengawal','lalu lintas.']},
];
export const FINAL_INSTRUCTION = 'Gabungkan kod daripada Stesen 1 hingga Stesen 6 untuk membuka Peti Kejayaan!';
export const FINAL_SUCCESS = 'Tahniah! Kamu berjaya menyelesaikan semua misi OPS ImAn!';
export const FINAL_RETRY = 'Kod belum tepat. Semak susunan stesen dan cuba lagi.';
export const ACTIVITY_INSTRUCTIONS = [
 'Pilih imbuhan awalan yang sesuai bagi kata dasar ini.',
 'Padankan kata dasar dengan kata berimbuhan yang betul. Perhatikan ejaannya!',
 'Cari perkataan dalam grid. Pilih huruf pertama dan huruf terakhir, atau seret. Kemudian tekan Semak.',
 'Tekan kepingan mengikut urutan untuk membentuk perkataan. Kemudian tekan Semak.',
 'Lihat gambar. Pilih perkataan yang sesuai untuk melengkapkan ayat.',
 'Seret kad ke ruang ayat, atau pilih kad kemudian pilih ruang. Tekan Semak apabila ayat siap.',
];
export const SHORT_PROMPTS = ['Pilih kata berimbuhan awalan yang sesuai.','Padankan kad A dengan B. Kemudian Semak.','Cari kata. Pilih huruf pertama dan terakhir.','Susun kepingan menjadi perkataan.','Lengkapkan ayat dengan kata yang sesuai.','Susun kad menjadi ayat yang betul.'];
export function createItems(levels) {
 return levels.flatMap((level,l)=>STATION_CONTENT[l].map((entry,k)=>{
  const parts=entry.parts||['Anggota polis',entry.word,entry.object],answer=l===0?entry.prefix:entry.word;
  const spelling=['k','p','t','s'].includes(entry.base[0])&&!['cat','cap','cas','cuci','pam','pos'].includes(entry.base)?` Huruf ${entry.base[0]} digugurkan.`:'';
  return {...entry,id:`P${l+1}-C${k+1}`,level:l+1,index:k+1,action:`mission-${l+1}-${k+1}`,type:GAME_TYPES[l],gameType:GAME_TYPES[l],skill:level.skill,
   prompt:ACTIVITY_INSTRUCTIONS[l],instruction:ACTIVITY_INSTRUCTIONS[l],answer,accepted:[answer],parts,cards:[...parts],
   sentence:parts.join(' '),blank:`Anggota polis ______ ${entry.object}`,
   imageDescription:l===0?`Gambar petunjuk kata dasar ${entry.base}`:parts.join(' '),
   explanation:entry.explanation||`${entry.base} menjadi ${entry.word}.${spelling} Kata dasar: ${entry.base}. Awalan: ${entry.prefix}`,
   hint:[`Perhatikan bunyi awal kata dasar ${entry.base}. Pilih satu imbuhan.`,k<4?`Perhatikan huruf awal ${entry.base[0]}. Huruf ini digugurkan apabila menerima awalan yang sesuai.`:'Kata dasar cap mempunyai satu suku kata.',`Cari huruf pertama ${entry.word[0].toUpperCase()}. Ikut satu baris atau lajur.`,`Mulakan dengan kepingan ${entry.pieces?.[0]}.`,'Perhatikan perbuatan dan objek dalam gambar.',`Mulakan ayat dengan ${parts[0]}.`][l]
  };
 }));
}
export const normalize = value => String(value??'').trim().replace(/\s+/g,' ').toLocaleLowerCase('ms-MY');
export function shuffled(values,random=Math.random){
 const result=[...values];for(let i=result.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[result[i],result[j]]=[result[j],result[i]];}return result;
}
export function orderedChoices(item,state,random=Math.random){
 // Repair older two-choice activities without changing answers or learning records.
 const choices=[];for(const word of [item.answer,...(item.choices||[])])if(normalize(word)&&!choices.some(c=>normalize(c)===normalize(word)))choices.push(word);
 for(const word of (item.level===1&&item.gameType?['me-','mem-','men-','meng-','meny-','menge-']:STATION_CONTENT.flat().map(i=>i.word))){if(choices.length>=4)break;if(!choices.some(c=>normalize(c)===normalize(word)))choices.push(word);}
 choices.splice(4);
 const saved=state.choiceOrder;
 if(!Array.isArray(saved)||saved.length!==choices.length||new Set(saved).size!==choices.length||saved.some(c=>!choices.includes(c)))state.choiceOrder=shuffled(choices,random);
 return state.choiceOrder;
}
export function orderedIndices(values,state,key){
 const saved=state[key];if(!Array.isArray(saved)||saved.length!==values.length||new Set(saved).size!==values.length||saved.some(i=>!Number.isInteger(i)||i<0||i>=values.length))state[key]=shuffled(values.map((_,i)=>i));
 return state[key];
}
export function wordPaths(grid,word) {
 const target=word.toUpperCase(),paths=[];
 for(let y=0;y<grid.length;y++)for(let x=0;x<grid[y].length;x++)for(const [dx,dy] of [[1,0],[0,1]]){
  const cells=Array.from(target,(_,i)=>({x:x+dx*i,y:y+dy*i}));
  if(cells.map(p=>grid[p.y]?.[p.x]||'').join('')===target)paths.push(cells);
 }
 return paths;
}
export function makeWordSearch(item) {
 const word=item.answer.toUpperCase(),size=Math.max(8,word.length);if(!/^[A-Z]{2,12}$/.test(word))throw Error('Perkataan grid mestilah 2 hingga 12 huruf.');
 let seed=[...item.id+word].reduce((n,c)=>(Math.imul(n,31)+c.charCodeAt(0))>>>0,71);
 const random=n=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed%n;};
 for(let attempt=0;attempt<200;attempt++){
  const letters='ABCDEFGHIKLMNOPRSTU',grid=Array.from({length:size},()=>Array.from({length:size},()=>letters[random(letters.length)]));
  const vertical=item.index%2===0,x=vertical?1+random(size-2):random(size+1-word.length),y=vertical?random(size+1-word.length):1+random(size-2);
  const cells=Array.from(word,(letter,i)=>{const point={x:x+(vertical?0:i),y:y+(vertical?i:0)};grid[point.y][point.x]=letter;return point;});
  if(wordPaths(grid,word).length===1)return {grid,cells};
 }
 throw Error('Grid tidak dapat disediakan.');
}
export function selectedCells(start,end,size=8) {
 if(start==null||end==null)return [];
 const a={x:start%size,y:Math.floor(start/size)},b={x:end%size,y:Math.floor(end/size)};
 if((a.x!==b.x&&a.y!==b.y)||b.x<a.x||b.y<a.y)return [];
 const length=Math.max(b.x-a.x,b.y-a.y)+1;
 return Array.from({length},(_,i)=>({x:a.x+(b.x>a.x?i:0),y:a.y+(b.y>a.y?i:0)}));
}
export function newActivity(item){return {matchSelected:false,selection:null,start:null,end:null,tokens:[],slots:Array(item.parts?.length||3).fill(null),selectedCard:null,typing:false,draft:''};}
export function activityAnswer(item,state){
 if(item.type==='match'||item.type==='blank')return state.typing?state.draft:state.selection||'';
 if(item.type==='search'){const {grid}=makeWordSearch(item);return selectedCells(state.start,state.end,grid.length).map(p=>grid[p.y]?.[p.x]||'').join('').toLowerCase();}
 if(item.type==='scramble')return state.tokens.map(i=>item.pieces[i]).join('');
 if(item.type==='sentence')return state.slots.map(i=>i==null?'':item.cards[i]).join(' ');
 return state.selection||'';
}
export function activityCorrect(item,state){return normalize(activityAnswer(item,state))===normalize(item.type==='sentence'?item.sentence:item.answer);}
export function validateItem(item){
 if(['choice','match','blank'].includes(item.type)&&(!item.choices.includes(item.answer)||item.choices.length!==4||new Set(item.choices.map(normalize)).size!==4))throw Error('Sediakan tepat empat pilihan yang berbeza, termasuk satu jawapan yang betul.');
 if(item.type==='search')makeWordSearch(item);
 if(item.type==='scramble'){
  const orders=[[0,1,2],[0,2,1],[1,0,2],[1,2,0],[2,0,1],[2,1,0]];
  if(item.pieces.length!==3||!orders.some(tokens=>activityCorrect(item,{tokens})))throw Error('Tiga kepingan mesti boleh membentuk ejaan jawapan yang betul.');
 }
 if(item.type==='sentence'&&(item.cards.length<3||item.cards.length>5||!item.parts.every(part=>item.cards.includes(part))))throw Error('Sediakan 3–5 kad, termasuk semua bahagian ayat contoh.');
 return item;
}
export function placeCard(state,card,slot){
 if(!Number.isInteger(card)||card<0||slot<0||slot>=state.slots.length)return;
 const previous=state.slots.indexOf(card),displaced=state.slots[slot];
 if(previous>=0)state.slots[previous]=displaced;
 state.slots[slot]=card;state.selectedCard=null;
}
export function applyActivityHint(item,state){
 if(item.type==='search'){const {cells,grid}=makeWordSearch(item),first=cells[0];state.hintStart=first.y*grid.length+first.x;}
 if(item.type==='scramble'){const first=item.pieces.findIndex(piece=>item.answer.startsWith(piece));if(first>=0)state.tokens=[first,...state.tokens.filter(i=>i!==first)];}
 if(item.type==='sentence'){placeCard(state,item.cards.indexOf(item.parts[0]),0);state.firstFixed=true;}
 if(item.type==='match')state.matchHint=true;
}
export const stationComplete=(session,level)=>Array.from({length:session?.archived?4:5},(_,i)=>i+1).every(n=>session?.records?.[`P${level}-C${n}`]?.complete===true);
export const allStationsComplete=session=>[1,2,3,4,5,6].every(n=>stationComplete(session,n));
export function syncMissionProgress(session){
 session.saveVersion=SAVE_VERSION;
 if(!Array.isArray(session.codeDigits)||session.codeDigits.length!==6||session.codeDigits.some(d=>!/^\d$/.test(String(d))))session.codeDigits=[...DEFAULT_CODE];
 session.codeDigits=session.codeDigits.map(String);
 session.completedLevels=[1,2,3,4,5,6].filter(n=>stationComplete(session,n));
 session.earnedCodes=session.codeDigits.map((d,i)=>stationComplete(session,i+1)?d:null);
 session.finalMission??={complete:false,draft:Array(6).fill(''),selected:0};
 if(!Array.isArray(session.finalMission.draft)||session.finalMission.draft.length!==6)session.finalMission.draft=Array(6).fill('');
 session.finalMission.status=session.finalMission.complete&&allStationsComplete(session)?'open':allStationsComplete(session)?'ready':'locked';
 return session;
}
export function unlockFinal(session,code,now=new Date().toISOString()){
 syncMissionProgress(session);
 if(!allStationsComplete(session)||String(code)!==session.codeDigits.join(''))return false;
 if(!session.finalMission.complete){session.finalMission.complete=true;session.finalMission.completedAt=now;session.finalMission.activeMs=session.activeMs||0;session.completedAt=now;}
 session.finalMission.status='open';return true;
}
export function migrateProgress(data){
 data.sessions??=[];
 if((data.contentVersion||0)<CONTENT_VERSION){
  const archives=[];
  for(const s of data.sessions){
   if(s.archived||s.contentVersion===CONTENT_VERSION)continue;
   const archive={...structuredClone(s),id:s.id+'-edition2',archived:true,contentVersion:2};
   if(Object.keys(s.records||{}).length&&!data.sessions.some(x=>x.id===archive.id))archives.push(archive);
   Object.assign(s,{contentVersion:CONTENT_VERSION,createdAt:new Date().toISOString(),records:{},positions:{},stationMapVersions:{},completedLevels:[],earnedCodes:[],finalMission:null,certificate:null,completedAt:null,activeMs:0,levelMs:{},stars:0,powers:{hint:4,radio:4,path:6,two:3,double:2},powerLog:[],practice:[],cycleCount:0,levelRewards:[]});
  }
  data.sessions.push(...archives);
  if(Object.keys(data.overrides||{}).length){data.legacyOverrides=structuredClone(data.overrides);data.overrides={};}
  if(Object.keys(data.wordOverrides||{}).length){data.legacyWordOverrides=structuredClone(data.wordOverrides);data.wordOverrides={};}
  data.contentVersion=CONTENT_VERSION;
 }
 const old=(data.saveVersion||1)<SAVE_VERSION;
 if(old&&Object.keys(data.overrides||{}).length){data.legacyOverrides=structuredClone(data.overrides);data.overrides={};}
 for(const session of data.sessions||[]){
  for(const r of Object.values(session.records||{})){r.gameType??=(session.saveVersion||1)<SAVE_VERSION?'legacy':GAME_TYPES[(r.level||1)-1];r.activeMs??=0;}
  syncMissionProgress(session);
 }
 data.saveVersion=SAVE_VERSION;return data;
}
