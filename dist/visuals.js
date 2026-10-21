import {interiorMap} from './station-maps.js';
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
export const roadMaze=interiorMap;
