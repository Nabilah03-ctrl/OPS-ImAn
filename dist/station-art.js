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
 const action=['reading','helping','searching','traffic'][index-1];
 return `<svg xmlns="http://www.w3.org/2000/svg" class="${escape(className)}" data-scene="${level}-${index}" viewBox="0 0 600 390" role="img" aria-label="${escape(label)}"><rect width="600" height="390" rx="24" fill="#f1f6ff"/><image href="assets/v2/action-${action}.png" x="10" y="5" width="580" height="380" preserveAspectRatio="xMidYMid meet"/></svg>`;
}
