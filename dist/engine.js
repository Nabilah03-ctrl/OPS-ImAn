import {stationLayout,stationPath,STATION_MAP_VERSION} from './station-layouts.js';
export function makeMaze(level=1,easy=false){
 const width=21,height=17,layout=stationLayout(level),path=stationPath(level);
 const grid=Array.from({length:height},()=>Array(width).fill(1));
 for(const p of path)grid[p.y][p.x]=0;
 const points=layout.stops.map(([x,y],index)=>{const at=path.findIndex(p=>p.x===x&&p.y===y);return {index,challenge:path[at],gate:path[at+1]};});
 return {width,height,grid,path,points,start:path[0],end:path.at(-1),level:layout.id,easy,version:STATION_MAP_VERSION};
}
export function restoreStationPosition(session,maze=makeMaze(session.level,session.easy)){
 const key=String(session.level),solved=[0,1,2,3].filter(i=>session.records?.[`P${key}-C${i+1}`]?.complete);
 session.positions??={};session.stationMapVersions??={};const old=session.positions[key];
 if(session.stationMapVersions[key]!==STATION_MAP_VERSION||!old||!canMove(maze,old.x,old.y,solved)||!routeTo(maze,maze.start,old,solved).length){
  if(old&&session.stationMapVersions[key]!==STATION_MAP_VERSION){session.legacyPositions??={};session.legacyPositions[key]??={...old};}
  const next=maze.points.find((_,i)=>!solved.includes(i));
  const at=next?maze.path.findIndex(p=>p===next.challenge):maze.path.length-1;
  session.positions[key]={...(solved.length===0?maze.start:maze.path[Math.max(0,at-(next?2:0))])};
  session.stationMapVersions[key]=STATION_MAP_VERSION;
 }
 return session.positions[key];
}
export function canMove(maze,x,y,solved=[]){return maze.grid[y]?.[x]===0&&!maze.points.some((p,i)=>p.gate.x===x&&p.gate.y===y&&!solved.includes(i));}
export function routeTo(maze,start,end,solved=[]){
 const q=[[start]],seen=new Set([`${start.x},${start.y}`]);
 while(q.length){const p=q.shift(),c=p.at(-1);if(c.x===end.x&&c.y===end.y)return p;for(const [dx,dy]of[[1,0],[-1,0],[0,1],[0,-1]]){const n={x:c.x+dx,y:c.y+dy},key=`${n.x},${n.y}`;if(!seen.has(key)&&canMove(maze,n.x,n.y,solved)){seen.add(key);q.push([...p,n]);}}}return [];
}
export function clockText(ms){const s=Math.floor(ms/1000);return `${Math.floor(s/60).toString().padStart(2,'0')}:${(s%60).toString().padStart(2,'0')}`;}
export function csvCell(v){let s=String(v??'');if(/^[=+@\-\t\r]/.test(s))s="'"+s;return '"'+s.replaceAll('"','""')+'"';}
export function assessEvidence(attempts,hints,example){return example?'Selepas contoh':attempts>1||hints?'Selepas petunjuk':'Percubaan pertama';}
