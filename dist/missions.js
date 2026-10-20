// Shared rules for the six activities, saved progress and the final code.
export const SAVE_VERSION = 2;
export const DEFAULT_CODE = ['4','2','7','1','6','3'];
export const GAME_TYPES = ['choice','match','search','scramble','blank','sentence'];
export const GAME_NAMES = ['Pilih Jawapan','Padankan A dengan B','Cari Perkataan','Susun Perkataan','Isi Tempat Kosong','Bina Ayat'];
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
 'Pilih kata berimbuhan awalan yang sesuai.',
 'Pilih kad kata dasar A, kemudian kad B yang sepadan. Tekan Semak.',
 'Cari perkataan dalam grid. Pilih huruf pertama dan huruf terakhir, atau seret. Kemudian tekan Semak.',
 'Tekan kepingan mengikut urutan untuk membentuk perkataan. Kemudian tekan Semak.',
 'Pilih tempat kosong, kemudian pilih perkataan. Tekan Semak.',
 'Seret kad ke ruang ayat, atau pilih kad kemudian pilih ruang. Tekan Semak apabila ayat siap.',
];
export const SHORT_PROMPTS = ['Pilih kata berimbuhan awalan yang sesuai.','Padankan kad A dengan B. Kemudian Semak.','Cari kata. Pilih huruf pertama dan terakhir.','Susun kepingan menjadi perkataan.','Lengkapkan ayat dengan kata yang sesuai.','Susun kad menjadi ayat yang betul.'];
export function createItems(levels) {
 return levels.flatMap((level,l)=>CORE_WORDS.map((word,k)=>({
  ...word,id:`P${l+1}-C${k+1}`,level:l+1,index:k+1,type:GAME_TYPES[l],gameType:GAME_TYPES[l],skill:level.skill,
  prompt:SHORT_PROMPTS[l],instruction:ACTIVITY_INSTRUCTIONS[l],
  choices:l===0?[['baca','membaca'],['bantu','membantu'],['mencari','membaca'],['membaca','mengawal','mencari']][k]:[word.word,CORE_WORDS[(k+1)%4].word,CORE_WORDS[(k+2)%4].word].sort(),
  answer:word.word,accepted:[word.word],sentence:word.parts.join(' '),blank:`Anggota polis ______ ${word.object}`,
  explanation:`${word.parts.join(' ')} ${word.base} menjadi ${word.word}.`,
  hint:[`Lihat gambar. ${word.parts.join(' ')}`,`Padankan kata dasar ${word.base} dengan ${word.word}.`,`Cari huruf pertama ${word.word[0].toUpperCase()}. Ikut satu baris atau lajur.`,`Mulakan dengan kepingan ${k===3?'me':'mem'===word.pieces[1]?'mem':'men'}.`,`Dengar ayat dan lihat gambar. ${word.parts.join(' ')}`,'Letakkan kad Anggota polis pada ruang pertama.'][l],
  cards:[...word.parts.slice(1),word.parts[0],...(k===3?['membaca']:[])],
 })));
}
export const normalize = value => String(value??'').trim().replace(/\s+/g,' ').toLocaleLowerCase('ms-MY');
export function wordPaths(grid,word) {
 const target=word.toUpperCase(),paths=[];
 for(let y=0;y<grid.length;y++)for(let x=0;x<grid[y].length;x++)for(const [dx,dy] of [[1,0],[0,1]]){
  const cells=Array.from(target,(_,i)=>({x:x+dx*i,y:y+dy*i}));
  if(cells.map(p=>grid[p.y]?.[p.x]||'').join('')===target)paths.push(cells);
 }
 return paths;
}
export function makeWordSearch(item) {
 const word=item.answer.toUpperCase();if(!/^[A-Z]{2,8}$/.test(word))throw Error('Perkataan grid mestilah 2 hingga 8 huruf.');
 let seed=[...item.id+word].reduce((n,c)=>(Math.imul(n,31)+c.charCodeAt(0))>>>0,71);
 const random=n=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed%n;};
 for(let attempt=0;attempt<200;attempt++){
  const letters='ABCDEFGHIKLMNOPRSTU',grid=Array.from({length:8},()=>Array.from({length:8},()=>letters[random(letters.length)]));
  const vertical=item.index%2===0,x=vertical?1+random(6):random(9-word.length),y=vertical?random(9-word.length):1+random(6);
  const cells=Array.from(word,(letter,i)=>{const point={x:x+(vertical?0:i),y:y+(vertical?i:0)};grid[point.y][point.x]=letter;return point;});
  if(wordPaths(grid,word).length===1)return {grid,cells};
 }
 throw Error('Grid tidak dapat disediakan.');
}
export function selectedCells(start,end) {
 if(start==null||end==null)return [];
 const a={x:start%8,y:Math.floor(start/8)},b={x:end%8,y:Math.floor(end/8)};
 if((a.x!==b.x&&a.y!==b.y)||b.x<a.x||b.y<a.y)return [];
 const length=Math.max(b.x-a.x,b.y-a.y)+1;
 return Array.from({length},(_,i)=>({x:a.x+(b.x>a.x?i:0),y:a.y+(b.y>a.y?i:0)}));
}
export function newActivity(item){return {matchSelected:false,selection:null,start:null,end:null,tokens:[],slots:Array(item.parts?.length||3).fill(null),selectedCard:null,typing:false,draft:''};}
export function activityAnswer(item,state){
 if(item.type==='match'||item.type==='blank')return state.typing?state.draft:state.selection||'';
 if(item.type==='search'){const {grid}=makeWordSearch(item);return selectedCells(state.start,state.end).map(p=>grid[p.y][p.x]).join('').toLowerCase();}
 if(item.type==='scramble')return state.tokens.map(i=>item.pieces[i]).join('');
 if(item.type==='sentence')return state.slots.map(i=>i==null?'':item.cards[i]).join(' ');
 return state.selection||'';
}
export function activityCorrect(item,state){return normalize(activityAnswer(item,state))===normalize(item.type==='sentence'?item.sentence:item.answer);}
export function validateItem(item){
 if(['choice','match','blank'].includes(item.type)&&(!item.choices.includes(item.answer)||item.choices.length<2||item.choices.length>3))throw Error('Sediakan 2–3 pilihan termasuk jawapan yang betul.');
 if(item.type==='search')makeWordSearch(item);
 if(item.type==='scramble'){
  const orders=[[0,1,2],[0,2,1],[1,0,2],[1,2,0],[2,0,1],[2,1,0]];
  if(item.pieces.length!==3||!orders.some(tokens=>activityCorrect(item,{tokens})))throw Error('Tiga kepingan mesti boleh membentuk ejaan jawapan yang betul.');
 }
 if(item.type==='sentence'&&(item.cards.length<3||item.cards.length>5||!item.parts.every(part=>item.cards.includes(part))))throw Error('Sediakan 3–5 kad, termasuk semua bahagian ayat contoh.');
 return item;
}
export function placeCard(state,card,slot){
 if(!Number.isInteger(card)||slot<0||slot>=state.slots.length)return;
 const previous=state.slots.indexOf(card),displaced=state.slots[slot];
 if(previous>=0)state.slots[previous]=displaced;
 state.slots[slot]=card;state.selectedCard=null;
}
export function applyActivityHint(item,state){
 if(item.type==='search'){const first=makeWordSearch(item).cells[0];state.hintStart=first.y*8+first.x;}
 if(item.type==='scramble'){const first=item.pieces.findIndex(piece=>item.answer.startsWith(piece));if(first>=0)state.tokens=[first,...state.tokens.filter(i=>i!==first)];}
 if(item.type==='sentence'){placeCard(state,item.cards.indexOf('Anggota polis'),0);state.firstFixed=true;}
 if(item.type==='match')state.matchHint=true;
}
export const stationComplete=(session,level)=>[1,2,3,4].every(n=>session?.records?.[`P${level}-C${n}`]?.complete===true);
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
 const old=(data.saveVersion||1)<SAVE_VERSION;
 if(old&&Object.keys(data.overrides||{}).length){data.legacyOverrides=structuredClone(data.overrides);data.overrides={};}
 for(const session of data.sessions||[]){
  for(const r of Object.values(session.records||{})){r.gameType??=(session.saveVersion||1)<SAVE_VERSION?'legacy':GAME_TYPES[(r.level||1)-1];r.activeMs??=0;}
  syncMissionProgress(session);
 }
 data.saveVersion=SAVE_VERSION;return data;
}
