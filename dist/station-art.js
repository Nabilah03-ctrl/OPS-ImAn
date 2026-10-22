// One transparent 3D atlas, cropped by SVG viewports without duplicating bitmap data.
export const PROP_KINDS=['counter','report','clue-desk','evidence-board','files','magnifier','traffic-booth','signals','crossing','entrance','monitors','radio','hangar','flight-desk','tower','guard','help-desk','plant','fountain','tools'];
// Tight display windows exclude neighboring sprites where the generated grid varies slightly.
const PROP_RECTS=[[8,32,275,244],[289,26,276,251],[566,8,276,269],[850,4,272,275],[14,284,259,280],[279,314,285,254],[581,278,250,296],[920,282,136,285],[0,562,286,274],[287,568,275,274],[566,580,278,265],[844,575,278,272],[0,846,292,280],[309,853,256,278],[610,843,204,287],[850,844,261,283],[8,1137,277,265],[322,1134,215,268],[565,1138,280,264],[858,1143,264,259]];
export function stationObject(kind){
 const png={station:'location-1',prison:'location-4',welcome:'police-girl',patrol:'patrol-car',motorcycle:'motorcycle',helipad:'helicopter'};
 if(png[kind]){
  const parking=['patrol','motorcycle'].includes(kind)?'<path d="M18 40V166H184V40" fill="#546b86" fill-opacity=".12" stroke="#f9cf46" stroke-width="5"/>':'';
  const pad=kind==='helipad'?'<ellipse cx="100" cy="131" rx="95" ry="43" fill="#435569" stroke="#ffc928" stroke-width="6"/><path d="M78 114v38m44-38v38m-44-19h44" stroke="white" stroke-width="8"/>':'';
  return `${parking}${pad}<ellipse cx="100" cy="165" rx="70" ry="8" fill="#102a56" opacity=".12"/><image href="assets/v2/${png[kind]}.png" x="8" y="0" width="184" height="${kind==='helipad'?145:167}" preserveAspectRatio="xMidYMid meet"/>`;
 }
 const index=PROP_KINDS.indexOf(kind);if(index<0)return '';
 // Generated atlas: 1122 × 1402 pixels, four columns and five rows.
 const [x,y,w,h]=PROP_RECTS[index];
 return `<svg x="10" y="0" width="180" height="175" viewBox="${x} ${y} ${w} ${h}" overflow="hidden" preserveAspectRatio="xMidYMid meet"><image href="assets/stations/props-3d.png" width="1122" height="1402"/></svg>`;
}

export function actionScene(level,index,{className='station-question',label=''}={}){
 const escape=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 // Display windows follow the actual sprite edges, including props that extend past a cell.
 const windows={
  1:[[0,0,512,520],[512,0,512,520],[1024,0,512,520],[0,522,550,502],[565,522,465,502]],
  2:[[0,0,512,512],[512,0,512,512],[1024,0,512,512],[0,520,512,504],[520,520,530,504]],
  3:[[0,0,512,525],[512,0,512,525],[1024,0,512,525],[20,535,510,489],[550,535,550,489]],
  4:[[0,0,512,512],[512,0,512,512],[1024,0,512,512],[0,530,512,494],[540,530,510,494]],
  5:[[0,0,555,520],[570,0,454,520],[1050,0,486,520],[0,522,555,502],[570,522,480,502]],
  6:[[0,0,512,512],[512,0,512,512],[1024,0,512,512],[0,520,545,504],[555,520,490,504]]
 };
 const [x,y,w,h]=windows[level]?.[index-1]||[0,0,512,512];
 const clip='scene-window-'+level+'-'+index;
 return `<svg xmlns="http://www.w3.org/2000/svg" class="${escape(className)}" data-scene="${level}-${index}" viewBox="${x} ${y} ${w} ${h}" role="img" aria-label="${escape(label)}" overflow="hidden"><defs><clipPath id="${clip}"><rect x="${x}" y="${y}" width="${w}" height="${h}"/></clipPath></defs><image clip-path="url(#${clip})" href="assets/actions30/station-${level}.png" width="1536" height="1024"/></svg>`;
}
