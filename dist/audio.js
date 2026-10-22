let manifest={clips:{},scripts:{}},player=null,generation=0,dbPromise;
const ctx={enabled:true,rate:.9,volume:.6,notify:()=>{}};
export async function initAudio(options){Object.assign(ctx,options);try{manifest=await(await fetch('./audio-manifest.json')).json();}catch{}return manifest;}
export function audioConfig(options){Object.assign(ctx,options);}
export function audioScripts(){return manifest.scripts;}
export function isVoicePlaying(){return !!((player&&!player.paused)||window.speechSynthesis?.speaking);}
export function stopAudio(){generation++;if(player){player.pause();player=null;}window.speechSynthesis?.cancel();}
function db(){return dbPromise??=new Promise((resolve,reject)=>{const r=indexedDB.open('ops-iman-audio',1);r.onupgradeneeded=()=>r.result.createObjectStore('clips');r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error);});}
export async function customAudio(text){try{const d=await db();return await new Promise(r=>{const q=d.transaction('clips').objectStore('clips').get(text);q.onsuccess=()=>r(q.result);q.onerror=()=>r(null);});}catch{return null;}}
export async function saveRecording(text,file){if(!file.type.startsWith('audio/')||file.size>8*1024*1024)throw new Error('Pilih fail audio di bawah 8 MB.');const d=await db();await new Promise((r,j)=>{const t=d.transaction('clips','readwrite');t.objectStore('clips').put(file,text);t.oncomplete=r;t.onerror=()=>j(t.error);});}
export async function removeRecording(text){const d=await db();await new Promise((r,j)=>{const t=d.transaction('clips','readwrite');t.objectStore('clips').delete(text);t.oncomplete=r;t.onerror=()=>j(t.error);});}
export function voiceStatus(){const v=window.speechSynthesis?.getVoices().find(v=>v.lang.toLowerCase()==='ms-my');return v?`Suara peranti ms-MY: ${v.name}`:manifest.metadata?.voice?`Klip suara Malaysia: ${manifest.metadata.voice}`:'Klip sintesis Melayu disediakan.';}
export async function speak(text,{force=false}={}){
 if(!text||(!ctx.enabled&&!force))return;stopAudio();const token=generation;
 async function one(t){
  const custom=await customAudio(t);if(token!==generation)return;
  const v=window.speechSynthesis?.getVoices().find(v=>v.lang.toLowerCase()==='ms-my');
  if(!custom&&v){await new Promise(resolve=>{const u=new SpeechSynthesisUtterance(t);u.lang='ms-MY';u.voice=v;u.rate=ctx.rate;u.volume=ctx.volume;u.onend=resolve;u.onerror=resolve;speechSynthesis.speak(u);});return;}
  const src=custom?URL.createObjectURL(custom):manifest.clips[t];
  if(src){await new Promise(resolve=>{const a=new Audio(src);player=a;a.volume=ctx.volume;a.playbackRate=ctx.rate;a.onended=()=>{if(custom)URL.revokeObjectURL(src);resolve();};a.onerror=()=>{if(custom)URL.revokeObjectURL(src);if(token===generation)ctx.notify('Audio tidak dapat dimainkan. Teks masih tersedia.');resolve();};a.play().catch(err=>{if(token===generation&&err.name!=='AbortError')ctx.notify('Tekan butang audio untuk mendengar.');resolve();});});}
  else{ctx.notify('Audio untuk teks ini belum tersedia. Guru boleh memuat naik rakaman.');}
 }
 for(const t of Array.isArray(text)?text:[text]){if(token!==generation)break;await one(t);}
}
let audioContext;
export function chime(correct=true){if(!ctx.enabled)return;try{audioContext??=new(window.AudioContext||window.webkitAudioContext)();audioContext.resume();const t=audioContext.currentTime;[correct?523:330,correct?659:294,correct?784:0].filter(Boolean).forEach((f,i)=>{const o=audioContext.createOscillator(),g=audioContext.createGain();o.type='sine';o.frequency.value=f;g.gain.setValueAtTime(0,t+i*.11);g.gain.linearRampToValueAtTime(.045,t+i*.11+.02);g.gain.exponentialRampToValueAtTime(.001,t+i*.11+.22);o.connect(g).connect(audioContext.destination);o.start(t+i*.11);o.stop(t+i*.11+.23);});}catch{}}
