import { chromium } from 'playwright-core';
import fs from 'node:fs/promises';
import path from 'node:path';

const origin=process.env.PRINT_ORIGIN||'http://127.0.0.1:4173';
const root=path.resolve('dist');
const {printCatalog,createPrintMaze}=await import('../dist/print.js');
const checkOnly=process.argv.includes('--check');
const only=process.argv.find(arg=>arg.startsWith('--only='))?.slice(7);
const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
const output=path.join(root,'assets','pdf');
await fs.mkdir(output,{recursive:true});
const page=await browser.newPage({viewport:{width:1600,height:1200},deviceScaleFactor:1});
const failures=[];
const reports=[];
try {
  const maze=createPrintMaze();
  if(maze.path.length<8||maze.stops.length!==6||maze.path.some(([x,y])=>maze.grid[y][x]!==0))throw Error('Invalid printed maze');
  for(let n=1;n<maze.path.length;n++)if(Math.abs(maze.path[n][0]-maze.path[n-1][0])+Math.abs(maze.path[n][1]-maze.path[n-1][1])!==1)throw Error('Non-adjacent printed maze solution');
  console.log(`Maze verified: ${maze.path.length} cells; all six stops reachable.`);
  for(const entry of printCatalog.filter(entry=>!only||entry.id===only)){
    for(const ink of [false,true]){
      const filename=`${entry.id}${ink?'-ink':''}.pdf`;
      await page.goto(`${origin}/print-preview.html?id=${entry.id}${ink?'&ink=1':''}`,{waitUntil:'networkidle'});
      await page.waitForFunction(()=>document.documentElement.dataset.printReady==='true',{timeout:15000});
      await page.emulateMedia({media:'print'});
      const checks=await page.evaluate(()=>({
        pages:[...document.querySelectorAll('.page')].map((p,i)=>{
          const c=p.querySelector('.content'),footer=p.querySelector('.footer');
          const bounds=c.getBoundingClientRect(),last=Math.max(...[...c.children].map(e=>e.getBoundingClientRect().bottom));
          return {page:i+1,overflow:Math.round(Math.max(0,c.scrollHeight-c.clientHeight,last-footer.getBoundingClientRect().top)),horizontal:Math.round(Math.max(0,c.scrollWidth-c.clientWidth))};
        }),
        broken:[...document.images].filter(i=>!i.complete||!i.naturalWidth).map(i=>i.src),
        cardCount:document.querySelectorAll('.challenge').length,
        clippedCards:[...document.querySelectorAll('.challenge,.mission-card')].filter(e=>e.scrollHeight>e.clientHeight+2||e.scrollWidth>e.clientWidth+2).map(e=>e.querySelector('.card-code')?.textContent),
        teacher:document.body.textContent.includes('SALINAN GURU')
      }));
      const issues=checks.pages.filter(p=>p.overflow>3||p.horizontal>3);
      if(issues.length||checks.broken.length||checks.clippedCards.length)failures.push({filename,issues,broken:checks.broken,clippedCards:checks.clippedCards});
      if(entry.id==='challenge-cards'&&checks.cardCount!==30)failures.push({filename,error:'Not 30 challenge cards'});
      if(entry.teacher&&!checks.teacher)failures.push({filename,error:'Missing teacher-only label'});
      if(!checkOnly){
        const buffer=await page.pdf({path:path.join(output,filename),preferCSSPageSize:true,printBackground:true,displayHeaderFooter:false});
        const pdfPages=(buffer.toString('latin1').match(/\/Type \/Page\b/g)||[]).length;
        if(pdfPages!==checks.pages.length)failures.push({filename,error:`PDF has ${pdfPages} pages; expected ${checks.pages.length}`});
        if(!ink&&['kit-cover','maze-a3','challenge-cards','certificate'].includes(entry.id))await page.locator('.page').first().screenshot({path:path.resolve('tests',`print-${entry.id}.png`)});
      }
      reports.push({filename,pages:checks.pages.length,...(issues.length?{issues}:{})});
      console.log(`${checkOnly?'Checked':'Generated'} ${filename} (${checks.pages.length} pages)${issues.length?' OVERFLOW':''}`);
    }
  }
  let finalReports=reports,finalFailures=failures;
  if(only){
    const prior=JSON.parse(await fs.readFile(path.resolve('tests','print-report.json'),'utf8'));
    const names=reports.map(r=>r.filename);
    finalReports=[...prior.reports.filter(r=>!names.includes(r.filename)),...reports];
    finalFailures=[...prior.failures.filter(r=>!names.includes(r.filename)),...failures];
  }
  await fs.writeFile(path.resolve('tests','print-report.json'),JSON.stringify({mazePathLength:maze.path.length,reports:finalReports,failures:finalFailures},null,2));
  console.log(JSON.stringify({documents:reports.length,pages:reports.reduce((n,r)=>n+r.pages,0),failures},null,2));
  if(failures.length)process.exitCode=1;
}finally{await browser.close();}
