import {LEVELS} from './content.js';
const escape=(s='')=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export const art=name=>`assets/v2/${name}.png`;
export const avatarArt=avatar=>art(`police-${['boy','girl','hijab'].includes(avatar)?avatar:'boy'}`);
export function communityGallery(){return `<section class="community-gallery"><div class="section-title"><div><h2>Pasukan yang sedia membantu</h2><p>Kenali tugas dan peralatan dalam Bandar Polis ImAn.</p></div></div><div class="community-scenes">${[['action-crossing','Membantu murid melintas'],['action-returning','Memulangkan barang dijumpai'],['pose-radio','Berhubung melalui radio'],['pose-directions','Menunjukkan arah'],['pose-pilot','Pasukan kawalan udara']].map(([asset,title])=>`<figure><img src="${art(asset)}" alt="${title}" loading="lazy"><figcaption>${title}</figcaption></figure>`).join('')}</div><details class="equipment-collection"><summary>Kenali koleksi peralatan polis</summary><img src="${art('equipment')}" alt="Koleksi peralatan: gari sebagai objek berasingan, radio, buku nota, kanta, topi, lampu suluh, kon dan fail" loading="lazy"><p>Peralatan membantu pasukan menjalankan tugas dengan bertanggungjawab.</p></details></section>`;}
export function missionStatus(session,level){
 if(!session)return {label:'Boleh dimainkan',state:'available'};
 if(session.completedLevels.includes(level)||[1,2,3,4].every(i=>session.records[`P${level}-C${i}`]?.complete))return {label:'Selesai',state:'done'};
 if(Object.values(session.records).some(r=>r.level===level)||session.level===level)return {label:'Sedang dimainkan',state:'current'};
 const complete=LEVELS.filter(l=>session.completedLevels.includes(l.id)||[1,2,3,4].every(i=>session.records[`P${l.id}-C${i}`]?.complete)).map(l=>l.id);
 const unlocked=Math.max(1,session.level,...complete.map(n=>n+1));
 return level<=unlocked?{label:'Boleh dimainkan',state:'available'}:{label:'Belum dibuka',state:'locked'};
}
export function cityMap(session){
 const positions=[[16.5,4,25,2],[50,4,75,2],[83.5,4,75,35],[83.5,54,25,35],[50,54,25,68],[16.5,54,75,68]];
 const current=Math.min(6,Math.max(1,session?.level||1));
 const road=(d)=>`<path d="${d}" fill="none" stroke="#f8fbff" stroke-width="68" stroke-linejoin="round"/><path d="${d}" fill="none" stroke="#303642" stroke-width="50" stroke-linejoin="round"/><path d="${d}" fill="none" stroke="#ffda52" stroke-width="3" stroke-dasharray="13 16"/>`;
 return `<section class="city-map" aria-label="Peta enam lokasi Bandar Polis ImAn"><div class="city-map-board">
 <svg class="city-road desktop-roads" viewBox="0 0 1200 800" preserveAspectRatio="none" aria-hidden="true"><rect width="1200" height="800" rx="35" fill="#4bae55"/>${road('M65 325H1115V730H85')}${[198,600,1002].map(x=>road(`M${x} 235V325M${x} 635V730`)).join('')}<circle cx="1115" cy="515" r="49" fill="#303642" stroke="white" stroke-width="6"/><circle cx="1115" cy="515" r="20" fill="#16a34a" stroke="#ffc400" stroke-width="4"/><g fill="white">${[0,1,2,3,4].map(i=>`<rect x="${740+i*13}" y="302" width="7" height="46"/>`).join('')}</g></svg>
 <svg class="city-road mobile-roads" viewBox="0 0 800 1200" preserveAspectRatio="none" aria-hidden="true"><rect width="800" height="1200" rx="30" fill="#4bae55"/>${road('M70 342H730V742H70V1142H730')}${[200,600].map(x=>road(`M${x} 235V342M${x} 635V742M${x} 1035V1142`)).join('')}</svg>
 ${LEVELS.map((l,i)=>{const status=missionStatus(session,l.id),[x,y,mx,my]=positions[i];return `<button class="city-location ${status.state}" data-action="level" data-level="${l.id}" style="--x:${x}%;--y:${y}%;--mx:${mx}%;--my:${my}%" ${status.state==='locked'?'disabled':''}><span class="city-number">${status.state==='done'?'✓':l.id}</span><img src="${art('location-'+l.id)}" alt="" loading="lazy"><span class="city-location-label"><strong>${escape(l.name)}</strong><small>${escape(l.subtitle)}</small><span class="city-status">${status.state==='done'?'✓ ':status.state==='locked'?'○ ':'● '}${status.label}</span></span></button>`;}).join('')}
 <div class="city-patrol patrol-stop-${current}" aria-label="Kereta peronda di laluan misi ${current}"><img src="${art('patrol-car')}" alt="Kereta peronda POLIS"><span>Pasukan kamu</span></div>
 <span class="city-map-label">BANDAR POLIS IMAN</span><div class="city-traffic" aria-hidden="true"><i></i><i></i><i></i></div><div class="parked-helicopter" aria-hidden="true"><img src="${art('helicopter')}" alt=""><svg viewBox="0 0 120 24"><g class="helicopter-rotor"><path d="M4 12H116" stroke="#102a56" stroke-width="5" stroke-linecap="round"/><circle cx="60" cy="12" r="5" fill="#ffc400"/></g></svg></div></div></section>`;
}
const adjacent=(m,x,y)=>[[0,-1],[1,0],[0,1],[-1,0]].filter(([dx,dy])=>m.grid[y+dy]?.[x+dx]===0);
export function roadMaze({maze:m,position:p,solved=[],route=[],items=[],avatar='boy',level=1,camera=false}){
 const cell=50,W=m.width*cell,H=m.height*cell,span=450,view=camera?`${Math.max(0,Math.min(W-span,p.x*cell+25-span/2))} ${Math.max(0,Math.min(H-span,p.y*cell+25-span/2))} ${Math.min(span,W)} ${Math.min(span,H)}`:`0 0 ${W} ${H}`;
 let svg=`<svg class="maze-svg road-maze" id="maze" viewBox="${view}" role="img" aria-label="Maze jalan raya ${escape(LEVELS[level-1].name)}. Lokasi kamu: lajur ${p.x}, baris ${p.y}." data-x="${p.x}" data-y="${p.y}"><defs><pattern id="park-grass" width="50" height="50" patternUnits="userSpaceOnUse"><rect width="50" height="50" fill="#32a858"/><path d="M11 16l3-5 3 5M34 38l3-4 3 4" stroke="#68c36a" fill="none" stroke-width="2"/></pattern></defs><rect width="${W}" height="${H}" fill="url(#park-grass)"/>`;
 const occupied=new Set();
 for(let y=0;y<m.height;y++)for(let x=0;x<m.width;x++){
  const X=x*cell,Y=y*cell;
  if(m.grid[y][x]){svg+=`<rect class="cell-wall" x="${X+2}" y="${Y+2}" width="46" height="46" rx="7" fill="#32a858"/>`;continue;}
  svg+=`<rect class="cell-floor" x="${X}" y="${Y}" width="50" height="50" fill="#303642"/>`;
  const dirs=adjacent(m,x,y);
  for(const [dx,dy] of [[0,-1],[1,0],[0,1],[-1,0]]){
   if(m.grid[y+dy]?.[x+dx]!==0){const side=dx===-1?`M${X+2} ${Y}V${Y+50}`:dx===1?`M${X+48} ${Y}V${Y+50}`:dy===-1?`M${X} ${Y+2}H${X+50}`:`M${X} ${Y+48}H${X+50}`;svg+=`<path d="${side}" stroke="#d7e4ed" stroke-width="4"/>`;}
   else svg+=`<path d="M${X+25+dx*10} ${Y+25+dy*10}L${X+25+dx*22} ${Y+25+dy*22}" stroke="${dirs.length>2?'#ffc400':'#fff'}" stroke-width="2" opacity=".8"/>`;
  }
  if(dirs.length===4)svg+=`<circle cx="${X+25}" cy="${Y+25}" r="9" fill="none" stroke="#ffc400" stroke-width="2"/>`;
 }
 // Buildings and parks fit entirely on non-walkable blocks; the street grid stays exact.
 for(let y=1;y<m.height-2;y++)for(let x=1;x<m.width-2;x++){
  const cells=[[x,y],[x+1,y],[x,y+1],[x+1,y+1]];
  if(cells.every(([cx,cy])=>m.grid[cy]?.[cx]===1&&!occupied.has(`${cx},${cy}`))){cells.forEach(([cx,cy])=>occupied.add(`${cx},${cy}`));const building=(x+y)%3===0?level:(x+y)%6+1;svg+=`<rect x="${x*50+4}" y="${y*50+5}" width="92" height="90" rx="10" fill="#e7edf2" stroke="#102a56" stroke-width="1"/><image href="${art('location-'+building)}" x="${x*50+5}" y="${y*50+4}" width="90" height="90"/>`;}
 }
 for(let y=0;y<m.height;y++)for(let x=0;x<m.width;x++)if(m.grid[y][x]&&!occupied.has(`${x},${y}`)&&x>0&&y>0&&x<m.width-1&&y<m.height-1){svg+=`<path d="M${x*50+25} ${y*50+33}v10" stroke="#735125" stroke-width="5"/><circle cx="${x*50+25}" cy="${y*50+22}" r="14" fill="#087d42"/><circle cx="${x*50+21}" cy="${y*50+17}" r="8" fill="#5acb55"/>`;}
 route.forEach(c=>svg+=`<circle class="route" cx="${c.x*50+25}" cy="${c.y*50+25}" r="5"/>`);
 svg+=`<rect x="2" y="${m.start.y*50+2}" width="46" height="46" rx="4" fill="#303642" stroke="white" stroke-width="2"/><image href="${art('patrol-car')}" x="${(m.start.x-1)*50+2}" y="${m.start.y*50+2}" width="46" height="44"/><text x="${m.start.x*50+25}" y="${m.start.y*50+43}" text-anchor="middle" class="road-label">MULA</text><rect x="${m.end.x*50+3}" y="${m.end.y*50+3}" width="44" height="44" rx="8" fill="#174beb" stroke="#ffc400" stroke-width="3"/><text x="${m.end.x*50+25}" y="${m.end.y*50+28}" text-anchor="middle" class="road-label">TAMAT</text>`;
 m.points.forEach((pt,i)=>{const {challenge:c,gate:g}=pt,done=solved.includes(i);svg+=`<g class="${done?'open-gate':'gate'}"><rect x="${g.x*50+5}" y="${g.y*50+18}" width="40" height="14" rx="4" fill="${done?'#16a34a':'#ff8a00'}" stroke="#102a56" stroke-width="2"/><path d="M${g.x*50+11} ${g.y*50+20}l7 10m6-10 7 10" stroke="white" stroke-width="4"/><text x="${g.x*50+25}" y="${g.y*50+13}" text-anchor="middle" class="road-label">${done?'✓':'MISI '+(i+1)}</text></g><rect class="clue" x="${c.x*50+3}" y="${c.y*50+3}" width="44" height="44" rx="9" fill="white" stroke="#ffc400" stroke-width="3"/><image href="${art('action-'+(items[i]?.action||'reading'))}" x="${c.x*50+4}" y="${c.y*50+2}" width="42" height="40"/><circle cx="${c.x*50+40}" cy="${c.y*50+40}" r="10" fill="${done?'#16a34a':'#ffc400'}" stroke="#102a56"/><text x="${c.x*50+40}" y="${c.y*50+44}" text-anchor="middle" style="font-size:12px;fill:${done?'white':'#102a56'}">${done?'✓':i+1}</text>`;});
 svg+=`<g class="player" transform="translate(${p.x*50},${p.y*50})"><ellipse cx="25" cy="43" rx="21" ry="6" fill="#009dff" stroke="white" stroke-width="2"/><image href="${avatarArt(avatar)}" x="-6" y="-16" width="62" height="66"/></g></svg>`;
 if(camera){svg+=`<svg class="maze-minimap" viewBox="0 0 ${m.width*6} ${m.height*6}" role="img" aria-label="Peta kecil lokasi kamu"><rect width="100%" height="100%" fill="#168443"/>${m.grid.flatMap((row,y)=>row.map((v,x)=>v?'':`<rect x="${x*6}" y="${y*6}" width="6" height="6" fill="#fff"/>`)).join('')}<circle cx="${p.x*6+3}" cy="${p.y*6+3}" r="4" fill="#174beb" stroke="#ffc400" stroke-width="2"/></svg>`;}
 return svg;
}
