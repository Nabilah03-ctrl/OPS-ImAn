import {ITEMS,WORD_BANK,LEVELS} from './content.js';
import {actionScene} from './station-art.js';
import {makeWordSearch,GAME_NAMES,ACTIVITY_INSTRUCTIONS} from './missions.js';
const esc=(v='')=>String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const chunk=(a,n)=>Array.from({length:Math.ceil(a.length/n)},(_,i)=>a.slice(i*n,i*n+n));
const identity=o=>`<p>Nama: ${esc(o.name)||'____________________'} · Kelas: ${esc(o.className)||'__________'}</p>`;
const art=i=>actionScene(i.level,i.index,{className:'edition-art',label:i.imageDescription}).replace('href="assets/',`href="${new URL('./assets/',import.meta.url).href}`);
const order=(a,seed)=>{const out=[...a];let n=seed*971+19;for(let i=out.length-1;i>0;i--){n=(Math.imul(n,1664525)+1013904223)>>>0;const j=n%(i+1);[out[i],out[j]]=[out[j],out[i]];}return out;};
const bank=(a,seed=1)=>`<div class="edition-options">${order(a,seed).map(w=>`<span>□ ${esc(w)}</span>`).join('')}</div>`;
const grid=i=>{const {grid}=makeWordSearch(i);return `<table class="mission-grid">${grid.map(row=>`<tr>${row.map(c=>`<td>${c}</td>`).join('')}</tr>`).join('')}</table>`;};
const task=i=>{
 if(i.type==='choice')return `<p>Kata dasar: <b>${esc(i.base)}</b></p>${bank(i.choices,i.index)}`;
 if(i.type==='match')return `<p>Kata dasar: <b>${esc(i.base)}</b></p>${bank(i.choices,i.index)}<p>Padanan: ____________________</p>`;
 if(i.type==='blank')return `<p>${esc(i.blank)}</p>${bank(i.choices,i.index)}`;
 if(i.type==='search')return `<b>Cari: ${esc(i.answer.toUpperCase())}</b>${grid(i)}`;
 if(i.type==='scramble')return `${bank(i.pieces,i.index)}<p>Perkataan: ____________________</p>`;
 return `${bank(i.cards,i.index)}<p>Ayat: __________________________________</p><p>______________________________________</p>`;
};
export const EDITION_PRINT_CSS=`
.edition-art{width:40mm;height:40mm;flex-shrink:0;display:block;border-radius:3mm}
.edition-task{display:flex;gap:5mm;padding:4mm;border:1px dashed #174beb;border-radius:3mm;margin:4mm 0;break-inside:avoid;min-height:62mm}
.edition-task>div{flex:1;min-width:0}.edition-task h3{font-size:13pt}.edition-task p{font-size:12pt}
.edition-options{display:grid;grid-template-columns:1fr 1fr;gap:2mm;margin:3mm 0}.edition-options span{border:1px dashed #5477ad;border-radius:2mm;padding:2mm;font-size:14pt;overflow-wrap:anywhere}
.edition-task.search{min-height:100mm;align-items:center}.edition-task.search .mission-grid td{width:7mm;height:7mm;font-size:15pt}
.edition-task.sentence{min-height:88mm}.edition-task.scramble{min-height:59mm}.edition-key{border-bottom:1px solid #abbcd4;min-height:56mm;padding:3mm 0;font-size:11pt}.edition-key .edition-art{float:right;width:32mm;height:32mm}
.edition-challenge .edition-task{min-height:92mm}.edition-challenge .edition-task.search{min-height:92mm}.edition-picture{display:grid;grid-template-columns:1fr 1fr;gap:6mm}.edition-picture figure{margin:0;padding:3mm;border:1px dashed #5477ad}.edition-picture .edition-art{width:80mm;height:80mm}
.edition-observe{width:100%;border-collapse:collapse;font-size:10pt}.edition-observe th,.edition-observe td{padding:3mm;border:1px solid #657a95}.edition-observe td{height:26mm}
`;
export function editionPrintPages(id,o={}){
 const all=o.content?.items||ITEMS;
 const stationIds=['station-choice','station-match','station-search','station-scramble','station-blank','station-sentence'];
 const station=stationIds.indexOf(id)+1;
 const rows=items=>items.map(i=>`<section class="edition-task ${i.type}">${art(i)}<div><h3>${i.id}</h3>${task(i)}</div></section>`).join('');
 if(station)return chunk(all.filter(i=>i.level===station),station===3||station===6?2:3).map(items=>`<h2>Stesen ${station} · ${GAME_NAMES[station-1]}</h2>${identity(o)}<p class="small">${ACTIVITY_INSTRUCTIONS[station-1]}</p>${rows(items)}${station===4?'<p class="small">Kepingan membantu ejaan; kepingan bukan pecahan imbuhan.</p>':''}`);
 if(id==='challenge-cards')return chunk(all,2).map(items=>`<div class="edition-challenge">${items.map(i=>`<article class="challenge"><span class="card-code">${i.id} · ${GAME_NAMES[i.level-1]}</span><p class="small">${esc(i.instruction)}</p>${rows([i])}</article>`).join('')}</div>`);
 if(id==='worksheet')return stationIds.flatMap(key=>editionPrintPages(key,o));
 if(id==='sentence-cards')return editionPrintPages('station-sentence',o);
 if(id==='picture-cards')return chunk(all,4).map(items=>`<h2>Kad gambar perbuatan</h2><div class="edition-picture">${items.map(i=>`<figure>${art(i)}<figcaption>${i.id}</figcaption></figure>`).join('')}</div>`);
 if(id==='base-cards'||id==='fullword-cards')return chunk(WORD_BANK,8).map(items=>`<h2>${id==='base-cards'?'Kata dasar':'Kata berimbuhan lengkap'}</h2><div class="grid two">${items.map(w=>`<div class="cut word-card"><strong class="word">${esc(id==='base-cards'?w.base:w.word)}</strong>${id==='fullword-cards'?`<small>Kata dasar: ${esc(w.base)} · Awalan: ${w.prefix}</small>`:''}</div>`).join('')}</div>`);
 if(id==='prefix-cards')return [`<h2>Enam bentuk awalan meN-</h2><div class="grid two">${['me-','mem-','men-','meng-','meny-','menge-'].map(p=>`<div class="cut word-card"><strong class="word">${p}</strong></div>`).join('')}</div><p>Perhatikan perubahan ejaan bersama guru. Kad awalan ialah label kumpulan.</p>`];
 if(id==='answer-rubric')return LEVELS.flatMap(l=>chunk(all.filter(i=>i.level===l.id),3).map(items=>`<h2>Skema Stesen ${l.id}</h2><p class="small">SALINAN GURU · Lima cabaran bagi setiap stesen. Bantuan dibenarkan.</p>${items.map(i=>`<section class="edition-key">${art(i)}<strong>${i.id}: ${esc(i.type==='sentence'?i.sentence:i.answer)}</strong><p>Kata dasar: ${i.base} · Awalan: ${i.prefix}<br>Perkataan: ${i.word}</p><p>${esc(i.explanation)}</p>${i.type==='scramble'?`<p>Kepingan ejaan: ${i.pieces.join(' | ')}</p>`:''}${i.type==='search'?(()=>{const c=makeWordSearch(i).cells,a=c[0],b=c.at(-1);return `<p>Baris ${a.y+1}, lajur ${a.x+1} → baris ${b.y+1}, lajur ${b.x+1}.</p>`;})():''}</section>`).join('')}<p class="small">Catat jawapan pertama, cubaan dan bantuan. TP ditentukan oleh guru, bukan bintang atau masa.</p>`));
 if(id==='observation')return LEVELS.map(l=>`<h2>Pemerhatian · Stesen ${l.id}</h2>${identity(o)}<table class="edition-observe"><thead><tr><th>Cabaran</th><th>Jawapan pertama</th><th>Cubaan</th><th>Bantuan / bukti</th></tr></thead><tbody>${all.filter(i=>i.level===l.id).map(i=>`<tr><td>${i.id}</td><td></td><td></td><td></td></tr>`).join('')}</tbody></table><p>Pertimbangan TP guru: ______ · Tarikh: __________</p><p>Catatan: ________________________________________</p><p>_______________________________________________</p>`);
 return null;
}
