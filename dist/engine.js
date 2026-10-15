export function makeMaze(level=1,easy=false){
 const width=easy?9:Math.min(9+Math.floor((level-1)/2)*2,13), rows=easy?3:3+Math.floor((level-1)/2),height=(rows-1)*3+3;
 const grid=Array.from({length:height},()=>Array(width).fill(1)),path=[];
 const add=(x,y)=>{grid[y][x]=0;path.push({x,y});};
 for(let r=0;r<rows;r++){
  const y=1+r*3;
  if(r%2===0){for(let x=1;x<width-1;x++)add(x,y);}
  else{for(let x=width-2;x>=1;x--)add(x,y);}
  if(r<rows-1){const x=r%2===0?width-2:1;add(x,y+1);add(x,y+2);}
 }
 if(level>1&&!easy)for(let r=0;r<rows-1;r++)for(let x=3;x<width-3;x+=3){grid[2+r*3][x]=0;}
 // A four-way street with short dead ends adds a later-stage intersection.
 // Existing route, gate positions and saved player positions remain valid.
 if(level>=3&&!easy){grid[3][4]=0;grid[5][4]=0;}
 const points=[.19,.40,.62,.83].map((f,i)=>{const k=Math.max(2,Math.floor((path.length-2)*f));return {index:i,challenge:path[k-1],gate:path[k]};});
 return {width,height,grid,path,points,start:path[0],end:path.at(-1)};
}
export function canMove(maze,x,y,solved=[]){return maze.grid[y]?.[x]===0&&!maze.points.some((p,i)=>p.gate.x===x&&p.gate.y===y&&!solved.includes(i));}
export function routeTo(maze,start,end,solved=[]){
 const q=[[start]],seen=new Set([`${start.x},${start.y}`]);
 while(q.length){const p=q.shift(),c=p.at(-1);if(c.x===end.x&&c.y===end.y)return p;for(const [dx,dy]of[[1,0],[-1,0],[0,1],[0,-1]]){const n={x:c.x+dx,y:c.y+dy},key=`${n.x},${n.y}`;if(!seen.has(key)&&canMove(maze,n.x,n.y,solved)){seen.add(key);q.push([...p,n]);}}}return [];
}
export function clockText(ms){const s=Math.floor(ms/1000);return `${Math.floor(s/60).toString().padStart(2,'0')}:${(s%60).toString().padStart(2,'0')}`;}
export function csvCell(v){let s=String(v??'');if(/^[=+@\-\t\r]/.test(s))s="'"+s;return '"'+s.replaceAll('"','""')+'"';}
export function assessEvidence(attempts,hints,example){return example?'Selepas contoh':attempts>1||hints?'Selepas petunjuk':'Percubaan pertama';}
