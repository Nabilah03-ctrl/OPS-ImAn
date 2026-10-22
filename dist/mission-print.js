import {ITEMS,LEVELS} from './content.js';
import {editionPrintPages,EDITION_PRINT_CSS} from './edition-print.js';
import {DEFAULT_CODE,CORE_WORDS,makeWordSearch,GAME_NAMES,ACTIVITY_INSTRUCTIONS,stationComplete} from './missions.js';
const esc=(v='')=>String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const asset=new URL('./assets/v2/',import.meta.url).href;
export const missionPrintCatalog=[
 ['station-choice','Kad pilihan jawapan',2,'Pilih kata berimbuhan berdasarkan lima gambar.'],
 ['station-match','Kad padanan A–B',2,'Padankan kata dasar dan perkataan lengkap.'],
 ['station-search','Lembaran cari perkataan',3,'Lima grid, arah mendatar atau menegak.'],
 ['station-scramble','Kepingan susun perkataan',2,'Tiga kepingan suku kata bagi setiap perkataan.'],
 ['station-blank','Lembaran isi tempat kosong',2,'Lima ayat bergambar dan bank perkataan.'],
 ['station-sentence','Kad bina ayat',3,'Seret secara digital, susun kad secara maujud.'],
 ['mission-codes','Enam kad digit kod',1,'Digit mengikut sesi yang dipilih; stesen belum selesai ditandakan.'],
 ['success-chest','Papan Peti Kejayaan',1,'Enam slot digit mengikut urutan stesen.'],
].map(([id,title,n,description])=>({id,title,description,size:`A4 · ${n} halaman`,teacher:false,sessionBased:['mission-codes','success-chest'].includes(id)}));
export const MISSION_PRINT_CSS=EDITION_PRINT_CSS+`
.mission-sheet-row{display:flex;gap:5mm;align-items:center;border:1px dashed #174beb;border-radius:3mm;padding:4mm;margin:4mm 0;break-inside:avoid}.mission-sheet-row img{width:35mm;height:35mm;object-fit:contain}.mission-sheet-row>div{flex:1}.mission-sheet-row h3{font-size:15pt}.mission-bank{display:flex;flex-wrap:wrap;gap:3mm;margin:3mm 0}.mission-bank span{padding:3mm;border:1px dashed #174beb;border-radius:2mm;font-size:17pt;font-weight:bold}.mission-grid{border-collapse:collapse;margin:3mm 0}.mission-grid td{width:8mm;height:8mm;text-align:center;border:1px solid #5875a1;font-size:17pt;font-weight:bold;padding:0}.mission-grid .solution{background:#fff2ad}.mission-search-section{height:104mm;display:flex;align-items:center;justify-content:space-between;border-bottom:1px dashed #5875a1;gap:4mm}.mission-search-section img{width:45mm;height:45mm;object-fit:contain}.mission-search-section h3{font-size:16pt}.mission-print-codes{display:grid;grid-template-columns:1fr 1fr;gap:5mm;margin-top:5mm}.mission-print-code{height:63mm;border:2px dashed #174beb;border-radius:4mm;display:flex;align-items:center;gap:3mm;padding:4mm}.mission-print-code img{width:33mm;height:38mm;object-fit:contain}.mission-print-code strong{font-size:44pt;display:block;color:#174beb}.mission-print-code small{font-size:9pt}.mission-print-chest{border:5px solid #ffc400;background:#edf6ff;border-radius:15mm 15mm 5mm 5mm;padding:10mm 6mm;text-align:center;margin:10mm 0;min-height:100mm}.mission-print-chest h2{font-size:26pt;color:#174beb}.mission-print-slots{display:grid;grid-template-columns:repeat(6,1fr);gap:3mm;margin:10mm 0}.mission-print-slots div{border:2px dashed #174beb;height:28mm;font-size:24pt;padding-top:4mm}.mission-print-slots small{display:block;font-size:8pt}.mission-sentence-cut{border:1px dashed #174beb;border-radius:3mm;padding:4mm;margin:5mm 0;min-height:95mm}.mission-sentence-cut img{width:40mm;height:35mm;object-fit:contain;float:right}.mission-sentence-cut .mission-bank{clear:both}.mission-answer-row{border-bottom:1px solid #aabbd2;padding:5mm 0;line-height:1.5}.mission-answer-row img{width:25mm;height:25mm;object-fit:contain;float:right}.mission-print-passport .mission-print-code{height:57mm}.print-ink .mission-print-chest,.print-ink .mission-grid .solution{background:#fff}.print-ink .mission-print-chest{border-color:#555}.print-ink .mission-print-code strong{color:#111}
`;
const image=(item)=>`<img src="${asset}action-${item.action}.png" alt="Tugas polis">`;
const bank=words=>`<div class="mission-bank">${words.map(w=>`<span>${esc(w)}</span>`).join('')}</div>`;
const identity=o=>`<div class="identity">Nama: ${esc(o.name)||'____________________'} &nbsp; Kelas: ${esc(o.className)||'__________'}</div>`;
const grid=(item,solution=false)=>{const {grid,cells}=makeWordSearch(item),marks=new Set(cells.map(p=>`${p.x},${p.y}`));return `<table class="mission-grid" aria-label="Cari ${esc(item.answer)}">${grid.map((row,y)=>`<tr>${row.map((letter,x)=>`<td class="${solution&&marks.has(`${x},${y}`)?'solution':''}">${letter}</td>`).join('')}</tr>`).join('')}</table>`;};
export function missionCodeDigits(options){return options.session?.codeDigits?.map(String)||[...DEFAULT_CODE];}
export function missionPrintPages(id,o={}){
 const edition=editionPrintPages(id,o);if(edition)return edition;
 const level=['station-choice','station-match','station-search','station-scramble','station-blank','station-sentence'].indexOf(id)+1;
 const items=(o.content?.items||ITEMS).filter(i=>i.level===level);
 const heading=()=>`<h2>Stesen ${level} · ${GAME_NAMES[level-1]}</h2>${identity(o)}<p class="small">${ACTIVITY_INSTRUCTIONS[level-1]}</p>`;
 if(id==='station-choice')return [heading()+items.map(i=>`<div class="mission-sheet-row">${image(i)}<div><h3>${i.id} · Pilih jawapan</h3>${bank(i.choices.map(w=>'□ '+w))}</div></div>`).join('')];
 if(id==='station-match')return [heading()+`<div class="intro">Lukis garisan atau potong kad untuk membuat padanan.</div>`+items.map((i,k)=>`<div class="mission-sheet-row">${image(i)}<div><h3>${i.id}</h3>${bank([i.base,'→',items[[2,0,3,1][k]].answer])}</div></div>`).join('')];
 if(id==='station-search')return [0,2].map(start=>heading()+items.slice(start,start+2).map(i=>`<div class="mission-search-section"><div>${image(i)}<h3>${i.id}<br>${esc(i.answer.toUpperCase())}</h3><p class="small">Kiri ke kanan atau<br>atas ke bawah.</p></div>${grid(i)}</div>`).join(''));
 if(id==='station-scramble')return [heading()+items.map(i=>`<div class="mission-sheet-row">${image(i)}<div><h3>${i.id}</h3>${bank(i.pieces)}<p>Jawapan: ____________________</p></div></div>`).join('')+'<p class="small">Kepingan ialah bantuan ejaan, bukan pecahan imbuhan. Cantum tanpa tanda sempang.</p>'];
 if(id==='station-blank')return [heading()+items.map(i=>`<div class="mission-sheet-row">${image(i)}<div><h3>${i.id} · ${esc(i.blank)}</h3>${bank(i.choices)}</div></div>`).join('')];
 if(id==='station-sentence')return [0,2].map(start=>heading()+items.slice(start,start+2).map(i=>`<div class="mission-sentence-cut">${image(i)}<h3>${i.id}</h3><p>Potong kad dan susun ayat.</p>${bank(i.cards)}<p>Ayat: _____________________________________</p><p>__________________________________________</p></div>`).join(''));
 if(id==='mission-codes'||id==='passport'){
  const digits=missionCodeDigits(o),cards=`<div class="mission-print-codes">${LEVELS.map((l,k)=>`<div class="mission-print-code"><img src="${asset}location-${k+1}.png" alt="${esc(l.name)}"><div><b>Stesen ${k+1}</b><strong>${digits[k]}</strong><small>${o.session?(stationComplete(o.session,k+1)?'✓ Diperoleh':'Belum diperoleh · simpan dengan guru'):'Guru beri selepas 5 cabaran'}<br>□ C1 □ C2 □ C3 □ C4 □ C5</small></div></div>`).join('')}</div>`;
  const sheet=`<div class="mission-print-passport"><h2>${id==='passport'?'Pasport Misi Saya':'Enam Kad Digit Kod'}</h2>${identity(o)}<p class="small">${o.session?'Kod sesi murid yang dipilih.':'Set maujud menggunakan kod 427163.'} Susun mengikut nombor stesen.</p>${cards}</div>`;
  if(id==='mission-codes')return [sheet];
  return [sheet,`<h2>Perjalanan Bahasa Saya</h2>${identity(o)}${LEVELS.map((l,k)=>`<div class="mission-answer-row"><strong>${k+1}. ${esc(l.subtitle)}</strong><p>□ Selesai &nbsp; □ Dengan bantuan &nbsp; Digit: ______</p></div>`).join('')}<p>□ Peti Kejayaan dibuka &nbsp; □ Sijil diterima</p><p>Bantuan yang berguna: __________________________</p>`];
 }
 if(id==='success-chest')return [`<h2>Pusat Kawalan OPS ImAn</h2>${identity(o)}<p>Lengkapkan enam stesen. Letakkan kad digit mengikut urutan untuk membuka peti.</p><div class="mission-print-chest"><h2>★ PETI KEJAYAAN ★</h2><p>Enam stesen · Enam digit · Satu misi hebat</p><div class="mission-print-slots">${LEVELS.map(l=>`<div><small>Stesen ${l.id}</small>□</div>`).join('')}</div><p>□ Semak bersama guru &nbsp; □ Peti dibuka!</p></div><p>Kamu boleh melihat Kad Kod Saya. Tiada had masa atau penalti.</p><p>“Bijak Berbahasa, Sedia Membantu!”</p>`];
 if(id==='answer-rubric')return LEVELS.map(l=>`<h2>Skema Stesen ${l.id} · ${esc(l.subtitle)}</h2><p class="small">SALINAN GURU · Lima cabaran. Bantuan dibenarkan.</p>${ITEMS.filter(i=>i.level===l.id).map(i=>`<div class="mission-answer-row">${image(i)}<strong>${i.id} · ${esc(i.type==='sentence'?i.sentence:i.answer)}</strong><p>${esc(i.base)} → ${esc(i.answer)}<br>${esc(i.sentence)}</p>${i.type==='scramble'?`<p>Urutan kepingan: ${esc(i.index===4?'me | nga | wal':i.index===1?'mem | ba | ca':i.index===2?'mem | ban | tu':'men | ca | ri')}</p>`:''}${i.type==='search'?(()=>{const cells=makeWordSearch(i).cells,a=cells[0],b=cells.at(-1);return `<p>Baris ${a.y+1}, lajur ${a.x+1} → baris ${b.y+1}, lajur ${b.x+1}.</p>`;})():''}</div>`).join('')}<div class="note">Rekod jawapan pertama, cubaan, bantuan dan masa aktif. TP ditentukan oleh guru. Kod sesi: ${missionCodeDigits(o).join('')}. Masa memasukkan kod bukan ukuran penguasaan bahasa.</div>`);
 return null;
}

// Session-specific downloadable cards use the same saved digits as the HTML print view.
export async function downloadSessionCodes(options={}){
 const {PDFDocument,rgb}=await import('./vendor/pdf-lib.js'),{default:fontkit}=await import('./vendor/fontkit.js');
 const doc=await PDFDocument.create();doc.registerFontkit(fontkit);
 const font=await doc.embedFont(await(await fetch(new URL('./assets/nunito-bold.ttf',import.meta.url))).arrayBuffer(),{subset:true});
 const page=doc.addPage([595.28,841.89]),ink=options.ink,blue=ink?rgb(.1,.1,.1):rgb(.06,.16,.34),gold=ink?rgb(.5,.5,.5):rgb(1,.77,0);
 const text=(value,x,y,size=14)=>page.drawText(String(value),{x,y,size,font,color:blue});
 text('OPS ImAn · Kad Kod Saya',32,798,26);text(`Nama: ${options.name||'________________'}`,32,773,12);text(`Kelas: ${options.className||'________'}`,32,754,12);
 const digits=missionCodeDigits(options);
 for(let index=0;index<6;index++){
  const x=32+(index%2)*270,y=520-Math.floor(index/2)*218;
  page.drawRectangle({x,y,width:260,height:204,borderWidth:2,borderColor:gold});
  text(`STESEN ${index+1}`,x+18,y+173,17);text(digits[index],x+172,y+86,65);
  const bytes=await(await fetch(new URL(`./assets/v2/location-${index+1}.png`,import.meta.url))).arrayBuffer();
  let image;if(ink){const blob=new Blob([bytes],{type:'image/png'}),bitmap=await createImageBitmap(blob),canvas=document.createElement('canvas');canvas.width=256;canvas.height=256;const ctx=canvas.getContext('2d');ctx.filter='grayscale(1)';ctx.drawImage(bitmap,0,0,256,256);const grey=await new Promise(resolve=>canvas.toBlob(resolve));image=await doc.embedPng(await grey.arrayBuffer());bitmap.close();}else image=await doc.embedPng(bytes);
  page.drawImage(image,{x:x+15,y:y+45,width:130,height:120});
  text(options.session?(stationComplete(options.session,index+1)?'Selesai · Digit diperoleh':'Belum diperoleh · Simpan dengan guru'):'Berikan selepas 5 cabaran',x+12,y+20,10);
 }
 text('Susun digit mengikut Stesen 1 hingga Stesen 6. Bantuan dibenarkan.',32,45,11);
 const bytes=await doc.save(),url=URL.createObjectURL(new Blob([bytes],{type:'application/pdf'})),a=document.createElement('a');a.href=url;a.download=`Kad_Kod_OPS_ImAn_${String(options.name||'Murid').replace(/[^\p{L}\p{N}]+/gu,'_')}.pdf`;a.click();setTimeout(()=>URL.revokeObjectURL(url),30000);
 return bytes;
}
