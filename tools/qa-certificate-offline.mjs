import {chromium} from 'playwright-core';
import fs from 'node:fs';
import assert from 'node:assert/strict';
const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
try{
 const c=await browser.newContext(),p=await c.newPage();await p.goto('http://127.0.0.1:4173');await p.locator('[data-action=info]').click();await p.locator('[data-action=cache-offline]').click();await p.waitForFunction(()=>document.querySelector('#offline-progress')?.textContent.startsWith('Aset luar talian tersedia'),null,{timeout:60000});
 await c.setOffline(true);await p.reload();await p.locator('h1').waitFor();
 const result=await p.evaluate(async()=>{
  const {makeCertificatePDF}=await import('/certificate-pdf.js'),{CERTIFICATE_VOICE}=await import('/certificate.js');
  const bytes=await makeCertificatePDF({displayName:'Sijil Luar Talian',className:'2 Bestari',teacherName:'Cikgu Farah',completedAt:'2026-10-15T01:00:00Z'});
  const m=await(await fetch('/audio-manifest.json')).json(),audio=await(await fetch(m.clips[CERTIFICATE_VOICE])).arrayBuffer(),ctx=new AudioContext(),decoded=await ctx.decodeAudioData(audio);let peak=0;for(const sample of decoded.getChannelData(0))peak=Math.max(peak,Math.abs(sample));await ctx.close();
  return {pdfHeader:String.fromCharCode(...bytes.slice(0,4)),pdfBytes:bytes.length,audioDuration:decoded.duration,audioPeak:peak};
 });assert.equal(result.pdfHeader,'%PDF');assert.ok(result.pdfBytes>10000);assert.ok(result.audioDuration>1&&result.audioPeak>.001);fs.writeFileSync('artifacts/qa-certificate-offline.json',JSON.stringify({passed:true,...result},null,2));console.log(JSON.stringify({passed:true,...result}));
}finally{await browser.close();}
