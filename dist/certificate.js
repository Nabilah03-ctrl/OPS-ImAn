import {ITEMS} from './content.js';
import {LEGACY_ITEMS} from './legacy-content.js';
import {allStationsComplete} from './missions.js';
import {clockText} from './engine.js';

export const CERTIFICATE_VOICE='Tahniah! Kamu berjaya menyelesaikan misi OPS ImAn. Teruskan usaha menjadi wira imbuhan awalan!';
export const CERTIFICATE_BADGES=[['Pilih Imbuhan','book'],['Padankan Kata','cards'],['Cari Perkataan','search'],['Susun Perkataan','check'],['Isi Tempat Kosong','radio'],['Bina Ayat','pencil']];
export const CERT_WIDTH=1188,CERT_HEIGHT=840;
const esc=(s='')=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const clean=s=>String(s??'').replace(/[\u0000-\u001f\u007f]/g,' ').replace(/\s+/g,' ').trim();
export function certificateEligible(session){return !!session&&allStationsComplete(session)&&session.finalMission?.complete===true;}
export function completionDate(session){
 if(!certificateEligible(session))return null;
 if(session.finalMission?.completedAt)return session.finalMission.completedAt;
 if(session.completedAt&&!Number.isNaN(Date.parse(session.completedAt)))return session.completedAt;
 const items=session.archived?LEGACY_ITEMS:ITEMS;
 const dates=items.map(i=>session.records[i.id]?.completedAt).filter(d=>d&&!Number.isNaN(Date.parse(d)));
 return dates.length===items.length?new Date(Math.max(...dates.map(d=>Date.parse(d)))).toISOString():null;
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
 const c=ink?{blue:'#303030',gold:'#777777',light:'#ffffff',mint:'#ffffff',paper:'#ffffff',teal:'#333333',ink:'#222222',muted:'#555555',pale:'#dddddd',white:'#ffffff'}:{blue:'#174586',gold:'#dfac43',light:'#e3effc',mint:'#def3ef',paper:'#fcfdf9',teal:'#087f8c',ink:'#233f60',muted:'#5d7188',pale:'#d3e4ec',white:'#ffffff'};
 const path=(d,fill,stroke,width=1,extra={})=>nodes.push({kind:'path',d,fill,stroke,width,...extra});
 const rect=(x,y,w,h,r,fill,stroke,width=1)=>path(rounded(x,y,w,h,r),fill,stroke,width);
 const text=(value,x,y,size=18,weight='regular',color=c.ink,align='middle',extra={})=>nodes.push({kind:'text',value:clean(value),x,y,size,weight,color,align,...extra});
 const circle=(x,y,r,fill,stroke,width=1)=>nodes.push({kind:'circle',x,y,r,fill,stroke,width});
 // Four drawing units equal one millimetre. Every decoration stays inside
 // the 10 mm print-safe area, including the outside stroke of the frame.
 rect(0,0,CERT_WIDTH,CERT_HEIGHT,0,c.white);
 rect(44,44,1100,752,28,ink?c.white:c.blue,c.gold,2);
 rect(57,57,1074,726,22,c.paper,c.gold,3);
 path('M59 80Q59 59 81 59H257Q203 196 59 204Z',c.mint);
 path('M931 59H1107Q1129 59 1129 81V204Q989 202 931 59Z',c.light);
 path('M59 746Q594 802 1129 746V759Q1129 781 1107 781H81Q59 781 59 759Z',ink?c.white:'#e6f4f5');
 path('M277 70H911M70 214V730M1118 214V730',undefined,c.pale,.8);
 for(const x of [88,1100]){
  path(`M${x-9} 292h18v24h-12v24h12v24h-18`,undefined,c.pale,1.5);
  for(let j=0;j<3;j++){circle(x+(j%2?5:-5),392+j*21,2,c.pale);path(rounded(x+(j%2?2:-8),396+j*21,6,9,3),c.pale);}
 }
 for(const [x,y,r]of[[111,106,10],[276,104,6],[1076,108,10],[914,98,6],[185,230,6],[1002,229,6],[104,504,7],[1084,506,7]])path(star(x,y,r),c.gold);
 path('M554 83Q594 96 634 83V123Q634 156 594 177Q554 156 554 123Z',ink?c.white:c.blue,c.gold,2.8);
 path(star(594,109,10),c.gold);text('MISI',594,136,13,'bold',ink?c.ink:c.white);text('SELESAI',594,153,13,'bold',ink?c.ink:c.white);
 text('OPS ImAn',594,204,22,'black',c.blue);
 text('SIJIL PENGHARGAAN',594,249,40,'black',c.blue);
 rect(364,265,460,34,17,ink?c.white:c.teal,ink?c.pale:undefined,1);
 text('WIRA IMBUHAN AWALAN',594,288,18,'bold',ink?c.ink:c.white);
 text('Dengan bangganya diberikan kepada',594,326,17,'regular',c.muted);
 const name=clean(details.displayName)||'[NAMA MURID]',fit=fitCertificateText(name,(t,s)=>measure(t,s,'black'),{maxSize:60,maxWidth:840,maxHeight:88});
 const baseline=342+(88-fit.lines.length*fit.lineHeight)/2+fit.size;
 fit.lines.forEach((line,i)=>text(line,594,baseline+i*fit.lineHeight,fit.size,'black',c.blue,'middle',{role:'student-name'}));
 path('M419 449H554M634 449H769',undefined,c.gold,1.8);path(star(594,449,7),c.gold);
 const classText='Kelas: '+(clean(details.className)||'[KELAS]');text(classText,594,476,Math.min(18,700/Math.max(1,measure(classText,1,'bold'))),'bold',c.teal);
 ['atas usaha dan kejayaan menyelesaikan enam misi','permainan OPS ImAn dalam pembelajaran','kata berimbuhan awalan.'].forEach((line,i)=>text(line,594,506+i*22,17));
 text('“Bijak Berbahasa, Sedia Membantu!”',594,581,20,'bold',c.blue);
 rect(354,592,480,23,11,ink?c.white:c.mint,ink?c.pale:undefined,.7);
 text(details.template?'Enam misi · Satu usaha yang membanggakan':'6 daripada 6 stesen selesai · Masa aktif: '+clockText(details.activeMs||0),594,608,12.5,'bold',c.teal);
 nodes.push({kind:'image',src:'assets/v2/police-boy.png',x:98,y:537,w:132,h:174,ink});
 nodes.push({kind:'image',src:`assets/v2/police-${details.avatar==='girl'?'girl':'hijab'}.png`,x:958,y:537,w:132,h:174,ink});
 nodes.push({kind:'image',src:'assets/v2/patrol-car.png',x:107,y:127,w:143,h:96,ink});
 nodes.push({kind:'image',src:'assets/v2/helicopter.png',x:938,y:121,w:148,h:103,ink});
 const badgeColors=['#2368b5','#8056b5','#078693','#b57709','#25846b','#b94f78'];
 CERTIFICATE_BADGES.forEach(([label,icon],i)=>{
  const x=240+i*120,color=ink?c.ink:badgeColors[i];
  rect(x,626,108,79,12,c.white,c.pale,.8);path(`M${x+3} 628H${x+105}`,undefined,color,4);
  path(ICONS[icon],undefined,color,1.6,{x:x+41,y:638,scale:1.1});
  const lines=label==='Isi Tempat Kosong'?['Isi Tempat','Kosong']:label.split(' ');
  lines.forEach((line,j)=>text(line,x+54,681+j*14,11.5,'bold',color));
 });
 text('Tarikh: '+formattedCompletionDate(details.completedAt),111,741,14,'bold',c.ink,'start');
 if(clean(details.schoolName)){
  const school=fitCertificateText(clean(details.schoolName),(t,s)=>measure(t,s,'regular'),{maxSize:12,minSize:10,maxWidth:440,maxLines:2,maxHeight:28});
  school.lines.forEach((line,i)=>text(line,111,760+i*school.lineHeight,school.size,'regular',c.muted,'start',{role:'school-name'}));
 }
 text('Disahkan oleh:',930,721,12,'regular',c.muted);path('M767 736H1093',undefined,c.muted,.8);
 const teacher=clean(details.teacherName)||'[NAMA GURU]',teacherFit=fitCertificateText(teacher,(t,s)=>measure(t,s,'bold'),{maxSize:14,minSize:10,maxWidth:326,maxLines:2,lineHeight:1.1,maxHeight:25});
 const teacherBaseline=739+(25-teacherFit.lines.length*teacherFit.lineHeight)/2+teacherFit.size;
 teacherFit.lines.forEach((line,i)=>text(line,930,teacherBaseline+i*teacherFit.lineHeight,teacherFit.size,'bold',c.ink,'middle',{role:'teacher-name'}));
 text('Guru Bahasa Melayu',930,779,12,'regular',c.muted);
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
