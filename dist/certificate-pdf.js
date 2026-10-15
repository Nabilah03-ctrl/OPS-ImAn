import {PDFDocument,rgb} from './vendor/pdf-lib.js';
import fontkit from './vendor/fontkit.js';
import {certificateScene,CERT_WIDTH,CERT_HEIGHT} from './certificate.js';

let fontBytes;
async function getFonts(){return fontBytes??=Promise.all(['regular','bold','black'].map(async n=>{const r=await fetch(new URL(`./assets/nunito-${n}.ttf`,import.meta.url));if(!r.ok)throw Error('Fon sijil belum tersedia. Muat turun aset atau sambung internet.');return new Uint8Array(await r.arrayBuffer());}));}
const color=hex=>{if(!hex)return undefined;return rgb(parseInt(hex.slice(1,3),16)/255,parseInt(hex.slice(3,5),16)/255,parseInt(hex.slice(5,7),16)/255);};
async function illustration(src,ink){
 const image=new Image();image.src=new URL(src,import.meta.url).href;await image.decode();
 const canvas=document.createElement('canvas'),ratio=Math.min(1,1080/Math.max(image.naturalWidth,image.naturalHeight));canvas.width=Math.round(image.naturalWidth*ratio);canvas.height=Math.round(image.naturalHeight*ratio);const context=canvas.getContext('2d');if(ink)context.filter='grayscale(1)';context.drawImage(image,0,0,canvas.width,canvas.height);
 const blob=await new Promise(resolve=>canvas.toBlob(resolve,'image/png'));if(!blob)throw Error('Ilustrasi sijil tidak dapat dijana.');return new Uint8Array(await blob.arrayBuffer());
}
export async function makeCertificatePDF(details,{ink=false}={}){
 const document=await PDFDocument.create();document.registerFontkit(fontkit);const bytes=await getFonts(),fonts={};
 for(const [i,name]of ['regular','bold','black'].entries())fonts[name]=await document.embedFont(bytes[i],{subset:true});
 document.setTitle('Sijil OPS ImAn — '+details.displayName);document.setAuthor('OPS ImAn');document.setSubject('Penghargaan atas penyelesaian enam misi imbuhan awalan');document.setLanguage('ms-MY');
 const scale=72/25.4/4,W=CERT_WIDTH*scale,H=CERT_HEIGHT*scale,page=document.addPage([W,H]);
 const scene=certificateScene(details,{ink,measure:(text,size,weight='regular')=>fonts[weight].widthOfTextAtSize(text,size)});
 for(const node of scene){
  if(node.kind==='text'){const font=fonts[node.weight],width=font.widthOfTextAtSize(node.value,node.size);page.drawText(node.value,{x:(node.x-(node.align==='start'?0:width/2))*scale,y:H-node.y*scale,size:node.size*scale,font,color:color(node.color)});}
  else if(node.kind==='path'){page.drawSvgPath(node.d,{x:(node.x||0)*scale,y:H-(node.y||0)*scale,scale:(node.scale||1)*scale,color:color(node.fill),borderColor:color(node.stroke),borderWidth:node.stroke?node.width*scale:0});}
  else if(node.kind==='circle'){page.drawCircle({x:node.x*scale,y:H-node.y*scale,size:node.r*scale,color:color(node.fill),borderColor:color(node.stroke),borderWidth:node.stroke?node.width*scale:0});}
  else if(node.kind==='image'){const image=await document.embedPng(await illustration(node.src,ink)),ratio=Math.min(node.w/image.width,node.h/image.height),w=image.width*ratio,h=image.height*ratio;page.drawImage(image,{x:(node.x+(node.w-w)/2)*scale,y:H-(node.y+(node.h+h)/2)*scale,width:w*scale,height:h*scale});}
 }
 return document.save();
}
