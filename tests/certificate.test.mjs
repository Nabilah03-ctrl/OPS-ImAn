import test from 'node:test';
import assert from 'node:assert/strict';
import {ITEMS} from '../dist/content.js';
import {certificateEligible,completionDate,ensureCertificate,certificateFileName,fitCertificateText,certificateScene,CERTIFICATE_BADGES} from '../dist/certificate.js';
const complete=()=>({finalMission:{complete:true},name:'Nur Aisyah',className:'2 Bestari',records:Object.fromEntries(ITEMS.map((i,k)=>[i.id,{complete:true,completedAt:new Date(Date.UTC(2026,9,15,1,k)).toISOString(),attempts:4,hints:3,shownExample:true,accuracy:null}]))});
test('all 30 challenges and an open chest qualify, including aided and legacy responses',()=>{
 const s=complete();assert.equal(certificateEligible(s),true);delete s.records['P6-C5'];assert.equal(certificateEligible(s),false);s.completedLevels=[1,2,3,4,5,6];s.practice=[{id:'P6-C5',complete:true}];assert.equal(certificateEligible(s),false);assert.equal(ensureCertificate(s),null);
});
test('completion date derives from last completed challenge and stays fixed',()=>{
 const s=complete(),last=s.records['P6-C5'].completedAt;assert.equal(completionDate(s),last);
 const a=ensureCertificate(s,{teacherName:'Cikgu Farah',schoolName:'SK ImAn'});assert.equal(a.completedAt,last);assert.equal(a.displayName,s.name);assert.equal(a.teacherName,'Cikgu Farah');
 s.certificate.displayName='Nur Aisyah Binti Ahmad';s.records['P6-C5'].completedAt='2027-01-01T01:00:00Z';assert.equal(ensureCertificate(s).completedAt,last);assert.equal(ensureCertificate(s,{teacherName:'Another'}).teacherName,'Cikgu Farah');assert.equal(s.name,'Nur Aisyah');
 const legacy=complete();delete legacy.records['P1-C1'].completedAt;assert.equal(completionDate(legacy),null);
});
test('long names wrap completely without overflowing their reserved region',()=>{
 const measure=(s,size)=>s.length*size*.65;
 for(const name of ['Nur Aisyah','Nur Aisyah Humaira Binti Muhammad Abdullah Al Amin','W'.repeat(160)]){const fit=fitCertificateText(name,measure,{maxHeight:100});assert.equal(fit.lines.join('').replaceAll(' ',''),name.replaceAll(' ',''));assert.ok(fit.lines.every(t=>measure(t,fit.size)<=760));assert.ok(fit.lines.length*fit.lineHeight<=100);}
});
test('certificate contains six mission badges and no assessment information',()=>{
 const s=complete();s.teacher={tp:6};s.stars=99;const scene=certificateScene(ensureCertificate(s)),copy=scene.filter(n=>n.kind==='text').map(n=>n.value).join(' ');assert.equal(CERTIFICATE_BADGES.length,6);assert.match(copy,/SIJIL PENGHARGAAN/);assert.match(copy,/WIRA IMBUHAN AWALAN/);assert.doesNotMatch(copy,/TP6|99|markah|kesalahan|kedudukan/i);assert.equal(certificateFileName('Nur Aisyah / Ahmad?'),'Sijil_OPS_ImAn_Nur_Aisyah_Ahmad.pdf');
});
