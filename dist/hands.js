let firedAtPoint=null;
let tracker=null,stream=null,running=false,request=0,lastFrame=-1,lastDetect=0,smoothed=null,raw=null,offset={x:0,y:0},target=null,dwellStart=0,fired=false,lastMove=0,missing=true,options={sensitivity:1.2,onStatus:()=>{},onMove:()=>{},onError:()=>{}};
const $=s=>document.querySelector(s);
function clearTarget(){target?.classList.remove('hand-hover');target=null;dwellStart=0;fired=false;const ring=$('.dwell-ring');if(ring)ring.style.strokeDashoffset='176';}
export function handTracked(){return running&&!missing;}
export function handSettings(o){Object.assign(options,o);}
export function calibrateHand(){if(!raw)return false;offset={x:.5-raw.x,y:.5-raw.y};smoothed=null;clearTarget();return true;}
export async function startHands(o={}){
 stopHands();Object.assign(options,o);const runId=++request;
 if(!window.isSecureContext||!navigator.mediaDevices?.getUserMedia)throw new Error('Kamera memerlukan HTTPS atau localhost. Kamu masih boleh menggunakan tetikus.');
 $('#camera-panel').hidden=false;$('#hand-status').textContent='Menyediakan kamera dan penjejakan…';
 try{
  const s=await navigator.mediaDevices.getUserMedia({video:{width:640,height:480,facingMode:'user'},audio:false});if(runId!==request){s.getTracks().forEach(t=>t.stop());return;}stream=s;const video=$('#hand-video');video.srcObject=s;await video.play();
  if(!tracker){const {FilesetResolver,HandLandmarker}=await import('./vendor/vision_bundle.js');const files=await FilesetResolver.forVisionTasks('./vendor/wasm');tracker=await HandLandmarker.createFromOptions(files,{baseOptions:{modelAssetPath:'./vendor/hand_landmarker.task'},runningMode:'VIDEO',numHands:1,minHandDetectionConfidence:.55,minHandPresenceConfidence:.55,minTrackingConfidence:.55});}
  if(runId!==request)return;running=true;missing=true;lastFrame=-1;lastDetect=0;smoothed=null;offset={x:0,y:0};options.onStatus(false);requestAnimationFrame(loop);
 }catch(e){if(runId!==request)return;stopHands();throw new Error(e.name==='NotAllowedError'?'Kebenaran kamera ditolak. Pilih Guna Tetikus untuk meneruskan.':`Kamera atau model penjejakan tidak dapat dimulakan. ${e.message}`);}
}
function loop(now){
 if(!running)return;
 try{
  const v=$('#hand-video');
  if(now-lastDetect>70&&v.readyState>=2&&v.currentTime!==lastFrame){lastDetect=now;lastFrame=v.currentTime;const result=tracker.detectForVideo(v,now),tip=result.landmarks?.[0]?.[8];
   if(!tip){if(!missing)options.onStatus(false);missing=true;smoothed=null;clearTarget();$('#hand-cursor').hidden=true;$('#hand-status').textContent='Tunjukkan tangan kamu di hadapan kamera.';}
   else{if(missing)options.onStatus(true);missing=false;raw={x:1-tip.x,y:tip.y};const mapped={x:Math.max(.015,Math.min(.985,(raw.x+offset.x-.5)*options.sensitivity+.5))*innerWidth,y:Math.max(.015,Math.min(.985,(raw.y+offset.y-.5)*options.sensitivity+.5))*innerHeight};smoothed=smoothed?{x:smoothed.x+(mapped.x-smoothed.x)*.32,y:smoothed.y+(mapped.y-smoothed.y)*.32}:mapped;const cursor=$('#hand-cursor');cursor.hidden=false;cursor.style.left=smoothed.x+'px';cursor.style.top=smoothed.y+'px';$('#hand-status').textContent='Tuding dan tahan. Kanta ialah penanda kamu.';const el=document.elementFromPoint(smoothed.x,smoothed.y)?.closest('button,[data-hand]');const next=el&&!el.disabled&&!el.closest('[inert]')?el:null;
    if(firedAtPoint&&(!next||Math.hypot(smoothed.x-firedAtPoint.x,smoothed.y-firedAtPoint.y)>44))firedAtPoint=null;
    if(next!==target){clearTarget();target=next;dwellStart=now;fired=!!firedAtPoint;target?.classList.add('hand-hover');}
    if(target?.dataset.dir){if(now-lastMove>360){options.onMove(target.dataset.dir);lastMove=now;}}
    else if(target&&!fired){const progress=Math.min((now-dwellStart)/1250,1);$('.dwell-ring').style.strokeDashoffset=String(176*(1-progress));if(progress>=1){fired=true;firedAtPoint={...smoothed};target.click();}}
   }
  }
 }catch(e){stopHands();options.onError(e);return;}
 requestAnimationFrame(loop);
}
export function stopHands(){firedAtPoint=null;request++;running=false;missing=true;stream?.getTracks().forEach(t=>t.stop());stream=null;const v=$('#hand-video');if(v)v.srcObject=null;const c=$('#hand-cursor');if(c)c.hidden=true;const p=$('#camera-panel');if(p)p.hidden=true;clearTarget();options.onStatus(false);}
