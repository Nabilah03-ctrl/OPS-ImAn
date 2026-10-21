// Coordinates are shared by the artwork, collision grid and saved-position migration.
export const STATION_MAP_VERSION=1;
export const STATIONS=[
 {id:1,theme:'courtyard',caption:'Selamat datang ke halaman balai',routeName:'Laluan U',
  vertices:[[2,5],[2,13],[18,13],[18,5]],stops:[[2,9],[7,13],[14,13],[18,8]],
  objects:[['counter','Kaunter pertanyaan',3.3,5.6,3.5,3.1],['report','Ruang laporan',5.4,9.7,3.7,2.3],['patrol','Parkir peronda',12,8.4,4.5,3.5],['welcome','Anggota penyambut',15,3.7,2.5,3.5]],
  decor:[['station','Balai Polis',7.5,1.1,6,6.1]]},
 {id:2,theme:'investigation',caption:'Empat ruang kerja, satu pasukan penyiasat',routeName:'Empat ruang kerja',
  vertices:[[2,7],[9,7],[9,3],[18,3],[18,12],[11,12],[11,15],[2,15]],stops:[[5,7],[18,6],[15,12],[6,15]],
  objects:[['clue-desk','Meja petunjuk',3,2.9,4.2,3.1],['evidence-board','Papan maklumat',12,4.1,4.3,3.1],['files','Rak fail',13,8,3.6,2.9],['magnifier','Kanta & nota',3,10.1,4.3,3.5]],decor:[]},
 {id:3,theme:'traffic',caption:'Berhenti, perhatikan dan lintas dengan selamat',routeName:'Gelung trafik',
  vertices:[[4,14],[2,14],[2,3],[18,3],[18,14],[6,14]],stops:[[2,9],[7,3],[18,8],[13,14]],
  objects:[['crossing','Lintasan selamat',3.3,8.5,3.2,3.4],['traffic-booth','Pondok trafik',5.3,4.2,4,3.3],['signals','Lampu isyarat',14.7,5.3,2.6,3.8],['motorcycle','Parkir motosikal',11.2,10,4.2,2.9]],decor:[]},
 {id:4,theme:'security',caption:'Kenali tempat bertugas pasukan keselamatan',routeName:'Laluan berselekoh',
  vertices:[[2,14],[6,14],[6,10],[13,10],[13,5],[18,5],[18,2]],stops:[[4,14],[9,10],[13,7],[16,5]],
  objects:[['entrance','Pintu masuk',2.3,10.2,2.9,2.7],['guard','Pondok pengawal',7.4,6.2,3.5,2.8],['prison','Bangunan penjara',7.6,.7,4.7,4.5],['monitors','Bilik pemantauan',15,6.5,4.5,3.6]],decor:[]},
 {id:5,theme:'garage',caption:'Setiap kenderaan dan alat ada tempatnya',routeName:'Lorong utama garaj',
  vertices:[[2,8],[18,8]],stops:[[4,8],[8,8],[12,8],[16,8]],
  objects:[['patrol','Petak kereta',2.6,3,4.1,3.8],['motorcycle','Petak motosikal',6.1,10.1,3.9,3.2],['help-desk','Bantuan penduduk',10.4,3.4,4,3.2],['radio','Radio & peralatan',14.3,10.1,4.2,3.2]],decor:[]},
 {id:6,theme:'airfield',caption:'Ikut laluan hingga ke helipad',routeName:'Misi menuju helipad',
  vertices:[[2,13],[6,13],[6,8],[11,8],[11,4],[18,4],[18,13]],stops:[[4,13],[9,8],[14,4],[18,10]],
  objects:[['hangar','Pintu hangar',1.3,8.1,3.9,3.9],['flight-desk','Meja penerbangan',7.4,9.5,3.4,3.1],['tower','Menara kawalan',12.5,.3,3.3,2.5],['helipad','Helipad',12.6,8.3,4.8,4.8]],decor:[]},
];
export function stationLayout(level=1){return STATIONS[Math.max(0,Math.min(5,Number(level)-1))];}
export function objectLabel([,label,x,y,w,h]){
 const width=Math.min(184,w*50),words=label.split(' ');let lines=[label];
 if(label.length*8>width-14&&words.length>1){const split=Math.ceil(words.length/2);lines=[words.slice(0,split).join(' '),words.slice(split).join(' ')];}
 return {x:(x+w/2)*50-width/2,y:(y+h)*50+5,width,height:lines.length===1?31:46,lines};
}
export function stationPath(level){
 const vertices=stationLayout(level).vertices,path=[{x:vertices[0][0],y:vertices[0][1]}];
 for(const [x,y] of vertices.slice(1)){let p=path.at(-1);if(p.x!==x&&p.y!==y)throw Error('Station paths must follow grid lines');while(p.x!==x||p.y!==y){p={x:p.x+Math.sign(x-p.x),y:p.y+Math.sign(y-p.y)};path.push(p);}}
 return path;
}
