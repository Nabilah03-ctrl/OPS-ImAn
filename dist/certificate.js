import {ITEMS} from './content.js';
import {allStationsComplete} from './missions.js';
import {clockText} from './engine.js';

export const CERTIFICATE_VOICE='Tahniah! Kamu berjaya menyelesaikan misi OPS ImAn. Teruskan usaha menjadi wira imbuhan awalan!';
export const CERTIFICATE_BADGES=[['Pilih Jawapan','book'],['Padankan Kata','cards'],['Cari Perkataan','search'],['Susun Perkataan','check'],['Isi Tempat Kosong','radio'],['Bina Ayat','pencil']];
export const CERT_WIDTH=1188,CERT_HEIGHT=840;
const esc=(s='')=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const clean=s=>String(s??'').replace(/[\u0000-\u001f\u007f]/g,' ').replace(/\s+/g,' ').trim();
export function certificateEligible(session){return !!session&&allStationsComplete(session)&&session.finalMission?.complete===true;}
export function completionDate(session){
 if(!certificateEligible(session))return null;
 if(session.finalMission?.completedAt)return session.finalMission.completedAt;
 if(session.completedAt&&!Number.isNaN(Date.parse(session.completedAt)))return session.completedAt;
 const dates=ITEMS.map(i=>session.records[i.id].completedAt).filter(d=>d&&!Number.isNaN(Date.parse(d)));
 return dates.length===ITEMS.length?new Date(Math.max(...dates.map(d=>Date.parse(d)))).toISOString():null;
}
export function ensureCertificate(session,settings={}){
 if(!certificateEligible(session))return null;
 const date=completionDate(session);if(date)session.completedAt=date;
 session.certificate??={displayName:clean(session.name),className:clean(session.className),teacherName:clean(settings.teacherName),schoolName:clean(settings.schoolName),ink:false};
 return {...session.certificate,completedAt:session.completedAt||null,avatar:session.avatar||'boy',activeMs:session.finalMission?.activeMs??session.activeMs??0};
}
export function certificateFileName(name){const safe=clean(name).replace(/[<>:"/\\|?*]/g,'').replace(/[. ]+$/,'').replace(/\s+/g,'_').slice(0,120)||'Murid';return `Sijil_OPS_ImAn_${safe}.pdf`;}
export function formattedCompletionDate(value){if(!value||Number.isNaN(Date.parse(value)))return '________________';return new Intl.DateTimeFormat('ms-MY',{timeZone:'Asia/Kuala_Lumpur',day:'numeric',month:'long',year:'numeric'}).format(new Date(value));}
export function fitCertificateText(text,measure,{maxSize=64,minSize=24,maxWidth=760,maxLines=3,lineHeight=1.12,maxHeight=114}={}){
 text=clean(text);const wrap=size=>{const result=[];let line='';for(const word of text.split(' ')){if(measure(word,size)>maxWidth){if(line){result.push(line);line='';}let part='';for(const char of word){if(part&&measure(part+char,size)>maxWidth){result.push(part);part=char;}else part+=char;}line=part;}else if(line&&measure(line+' '+word,size)>maxWidth){result.push(line);line=word;}else line=line?line+' '+word:word;}if(line)result.push(line);return result;};
 for(let size=maxSize;size>=minSize;size--){const lines=wrap(size);if(lines.length<=maxLines&&lines.length*size*lineHeight<=maxHeight)return {lines,size,lineHeight:size*lineHeight};}
 // Extremely long imported names still remain complete inside the same text region.
 for(let size=minSize-1;size>=8;size--){const lines=wrap(size);if(lines.length*size*lineHeight<=maxHeight)return {lines,size,lineHeight:size*lineHeight};}
 return {lines:wrap(8),size:8,lineHeight:8*lineHeight};
}
const rounded=(x,y,w,h,r)=>`M${x+r} ${y}H${x+w-r}Q${x+w} ${y} ${x+w} ${y+r}V${y+h-r}Q${x+w} ${y+h} ${x+w-r} ${y+h}H${x+r}Q${x} ${y+h} ${x} ${y+h-r}V${y+r}Q${x} ${y} ${x+r} ${y}Z`;
const star=(x,y,r)=>Array.from({length:10},(_,i)=>{const a=-Math.PI/2+i*Math.PI/5,rr=i%2?r*.43:r;return `${i?'L':'M'}${x+Math.cos(a)*rr} ${y+Math.sin(a)*rr}`;}).join('')+'Z';
const ICONS={book:'M2 3Q7 1 12 4Q17 1 22 3V21Q17 19 12 22Q7 19 2 21ZM12 4V22M5 7H9M5 11H9M15 7H19M15 11H19',cards:'M3 2H17V19H3ZM17 6H22V23H8V19M6 7H13M6 11H13',search:'M17 10A7 7 0 1 1 3 10A7 7 0 0 1 17 10M15 15L23 23',check:'M2 12L9 19L23 3',radio:'M6 7L4 1M4 7H21V23H4ZM8 11H17M8 15H17M8 19H12',pencil:'M3 18L17 4L22 9L8 23L2 24ZM14 7L19 12M3 18L8 23'};
export function certificateScene(details={},options={}){
 const ink=!!options.ink,measure=options.measure||((s,size)=>s.length*size*.52),nodes=[];
 const c=ink?{blue:'#303030',gold:'#707070',light:'#ffffff',mint:'#ffffff',orange:'#ffffff',ink:'#222222',muted:'#555555',pale:'#dddddd',white:'#ffffff'}:{blue:'#174beb',gold:'#ffc400',light:'#edf6ff',mint:'#d8f4df',orange:'#ffedd4',ink:'#102a56',muted:'#435e80',pale:'#c9d9ed',white:'#ffffff'};
 const path=(d,fill,stroke,width=1,extra={})=>nodes.push({kind:'path',d,fill,stroke,width,...extra});
 const rect=(x,y,w,h,r,fill,stroke,width=1)=>path(rounded(x,y,w,h,r),fill,stroke,width);
 const text=(value,x,y,size=18,weight='regular',color=c.ink,align='middle',extra={})=>nodes.push({kind:'text',value:clean(value),x,y,size,weight,color,align,...extra});
 const circle=(x,y,r,fill,stroke,width=1)=>nodes.push({kind:'circle',x,y,r,fill,stroke,width});
 rect(0,0,CERT_WIDTH,CERT_HEIGHT,0,c.white);rect(48,48,1092,744,30,c.light,c.blue,5);rect(59,59,1070,722,22,c.white,c.gold,2);rect(69,69,1050,702,16,undefined,c.pale,1);
 for(const x of [92,1096]){path(`M${x-12} 186h24v28h-18v28h18v28h-24m0 304h24v24h-18v30h18v20h-24`,undefined,c.pale,3);for(let j=0;j<3;j++){circle(x+(j%2?7:-7),306+j*23,3,c.pale);path(rounded(x+(j%2?3:-11),311+j*23,8,12,4),c.pale);}}
 for(const [x,y,r]of[[137,107,16],[1051,107,16],[198,149,9],[990,150,9],[128,665,12],[1062,653,12],[190,591,7],[1002,577,7]])path(star(x,y,r),ink?c.pale:'#f8db83');
 path('M552 83Q594 98 636 83V123Q630 153 594 165Q558 153 552 123Z',c.blue,c.gold,3);
 path(star(594,106,10),c.gold);text('MISI',594,133,14,'bold',c.white);text('SELESAI',594,150,14,'bold',c.white);
 text('OPS ImAn',594,191,20,'black',c.blue);
 text('SIJIL PENGHARGAAN',594,239,39,'black',c.blue);
 text('WIRA IMBUHAN AWALAN',594,271,20,'bold',c.muted);
 path('M438 288H750',undefined,c.gold,2);
 text('Dengan bangganya diberikan kepada',594,318,18);
 const name=clean(details.displayName)||'[NAMA MURID]',fit=fitCertificateText(name,(t,s)=>measure(t,s,'black'),{maxHeight:90});
 const baseline=329+(90-fit.lines.length*fit.lineHeight)/2+fit.size;
 fit.lines.forEach((line,i)=>text(line,594,baseline+i*fit.lineHeight,fit.size,'black',c.blue,'middle',{role:'student-name'}));
 const classText='Kelas: '+(clean(details.className)||'[KELAS]');text(classText,594,447,Math.min(19,700/Math.max(1,measure(classText,1,'bold'))),'bold');
 ['Atas usaha dan kejayaan menyelesaikan enam misi','pembelajaran kata berimbuhan awalan','dalam permainan OPS ImAn.'].forEach((line,i)=>text(line,594,480+i*25,19));
 text('“Bijak Berbahasa, Sedia Membantu!”',594,572,21,'bold',c.blue);
 text('6 daripada 6 stesen selesai · Masa aktif: '+clockText(details.activeMs||0),594,594,14,'bold',c.muted);
 circle(167,624,57,c.orange);
 nodes.push({kind:'image',src:'assets/v2/police-boy.png',x:97,y:547,w:140,h:154,ink});
 nodes.push({kind:'image',src:`assets/v2/police-${details.avatar==='hijab'?'hijab':'girl'}.png`,x:955,y:547,w:140,h:154,ink});
 nodes.push({kind:'image',src:'assets/v2/patrol-car.png',x:120,y:147,w:112,h:76,ink});
 nodes.push({kind:'image',src:'assets/v2/helicopter.png',x:956,y:141,w:112,h:82,ink});
 circle(1043,440,30,ink?c.white:'#e1f3ff',c.blue,6);circle(1043,440,21,undefined,c.gold,2);path('M1064 461L1091 488',undefined,c.blue,12);path('M1064 461L1091 488',undefined,c.gold,5);
 CERTIFICATE_BADGES.forEach(([label,icon],i)=>{const x=274+i*111;rect(x,605,103,84,13,i%2?c.light:c.mint,c.pale,1);path(ICONS[icon],undefined,c.blue,1.8,{x:x+36,y:615,scale:1.25});const lines=label==='Isi Tempat Kosong'?['Isi Tempat','Kosong']:label.split(' ');lines.forEach((line,j)=>text(line,x+51.5,663+j*15,12,'bold'));});
 text('Tarikh: '+formattedCompletionDate(details.completedAt),155,729,16,'bold',c.ink,'start');
 if(clean(details.schoolName)){const school=fitCertificateText(clean(details.schoolName),(t,s)=>measure(t,s,'regular'),{maxSize:16,minSize:11,maxWidth:480,maxLines:2,maxHeight:38});school.lines.forEach((line,i)=>text(line,155,754+i*school.lineHeight,school.size,'regular',c.muted,'start'));}
 text('Disahkan oleh:',930,711,15,'regular');path('M800 735H1060',undefined,c.muted,1.2);
 const teacher=clean(details.teacherName)||'[NAMA GURU]',teacherSize=Math.min(17,260/Math.max(1,measure(teacher,1,'bold')));
 text(teacher,930,754,teacherSize,'bold');text('Guru Bahasa Melayu',930,774,13,'regular',c.muted);
 return nodes;
}
let measureCanvas;
export function browserMeasure(t,size,weight='regular'){measureCanvas??=document.createElement('canvas');const ctx=measureCanvas.getContext('2d');ctx.font=`${weight==='black'?900:weight==='bold'?800:400} ${size}px Nunito`;return ctx.measureText(t).width;}
export function certificateSVG(details,options={}){
 const nodes=certificateScene(details,{measure:typeof document!=='undefined'?browserMeasure:undefined,...options});
 const html=nodes.map(n=>n.kind==='text'?`<text x="${n.x}" y="${n.y}" font-size="${n.size}" font-weight="${n.weight==='black'?900:n.weight==='bold'?800:400}" fill="${n.color}" text-anchor="${n.align==='start'?'start':'middle'}" ${n.role?`data-role="${n.role}"`:''}>${esc(n.value)}</text>`:n.kind==='image'?`<image href="${new URL(n.src,import.meta.url).href}" x="${n.x}" y="${n.y}" width="${n.w}" height="${n.h}" ${n.ink?'filter="url(#certificate-gray)"':''}/>`:n.kind==='circle'?`<circle cx="${n.x}" cy="${n.y}" r="${n.r}" fill="${n.fill||'none'}" stroke="${n.stroke||'none'}" stroke-width="${n.width}"/>`:`<path d="${n.d}" transform="translate(${n.x||0} ${n.y||0}) scale(${n.scale||1})" fill="${n.fill||'none'}" stroke="${n.stroke||'none'}" stroke-width="${n.width}" stroke-linecap="round" stroke-linejoin="round"/>`).join('');
 return `<svg class="certificate-art" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${CERT_WIDTH} ${CERT_HEIGHT}" role="img" aria-label="Sijil penghargaan OPS ImAn untuk ${esc(details.displayName)}" style="font-family:Nunito,'Segoe UI',sans-serif"><defs><filter id="certificate-gray"><feColorMatrix type="saturate" values="0"/></filter></defs>${html}</svg>`;
}
export function starShower(reduced=false){if(reduced)return '';return `<div class="certificate-stars" aria-hidden="true">${Array.from({length:18},(_,i)=>`<span style="--star-x:${4+i*5.3}%;--star-delay:${(i%5)*.08}s;--star-turn:${i%2?140:-110}deg">★</span>`).join('')}</div>`;}

export async function downloadCertificate(details,options={}){
 const {makeCertificatePDF}=await import('./certificate-pdf.js');const bytes=await makeCertificatePDF(details,options),url=URL.createObjectURL(new Blob([bytes],{type:'application/pdf'}));
 const a=document.createElement('a');a.href=url;a.download=certificateFileName(details.displayName);a.click();setTimeout(()=>URL.revokeObjectURL(url),30000);return bytes;
}
export function printCertificate(details,options={}){
 const w=window.open('','_blank');if(!w)return false;
 const assetRoot=new URL('./assets/',import.meta.url).href;
 w.document.write(`<!doctype html><html lang="ms-MY"><head><meta charset="utf-8"><title>${esc(certificateFileName(details.displayName).replace('.pdf',''))}</title><style>@font-face{font-family:Nunito;src:url('${assetRoot}nunito-regular.ttf');font-weight:400}@font-face{font-family:Nunito;src:url('${assetRoot}nunito-bold.ttf');font-weight:800}@font-face{font-family:Nunito;src:url('${assetRoot}nunito-black.ttf');font-weight:900}@page{size:A4 landscape;margin:10mm}*{box-sizing:border-box}body{margin:0;background:#e9f2ff;font:17px Nunito,Arial}.toolbar{text-align:center;padding:16px}.toolbar button{font:inherit;padding:12px 24px;cursor:pointer}.sheet{width:277mm;height:190mm;background:white;margin:15px auto;position:relative;overflow:hidden}.certificate-art{position:absolute;left:-10mm;top:-10mm;width:297mm;height:210mm}@media print{body{background:white}.toolbar{display:none}.sheet{margin:0;break-after:avoid}}</style></head><body><div class="toolbar"><button onclick="window.print()">Cetak Sijil / Simpan sebagai PDF</button><p>A4 landskap · Skala 100% · Matikan pengepala dan pengaki pelayar</p></div><div class="sheet">${certificateSVG(details,options)}</div></body></html>`);w.document.close();
 const illustrations=certificateScene(details,options).filter(n=>n.kind==='image').map(n=>{const img=new w.Image();img.src=new URL(n.src,import.meta.url).href;return img.decode();});
 Promise.all([w.document.fonts.load('400 18px Nunito'),w.document.fonts.load('800 18px Nunito'),w.document.fonts.load('900 64px Nunito'),...illustrations]).then(()=>{if(!w.closed)w.print();}).catch(()=>{if(!w.closed)w.document.querySelector('.toolbar p').textContent='Sila tunggu aset dimuatkan sebelum menekan Cetak Sijil.';});return w;
}
