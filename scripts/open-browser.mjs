import {spawn} from 'node:child_process';
const url='http://127.0.0.1:'+(process.env.PORT||4175)+'/';
let ready=false;for(let i=0;i<30;i++){try{const r=await fetch(new URL('/api/health',url),{signal:AbortSignal.timeout(1000)});const j=await r.json();if(j.ok&&j.application==='result-processing-system'){ready=true;break;}}catch{}await new Promise(r=>setTimeout(r,500));}
if(!ready){console.error('The website did not start. Check the server window for an error.');process.exit(1);}
if(process.platform==='win32')spawn('cmd.exe',['/d','/s','/c','start','',url],{detached:true,stdio:'ignore'}).unref();else if(process.platform==='darwin')spawn('open',[url],{detached:true,stdio:'ignore'}).unref();else spawn('xdg-open',[url],{detached:true,stdio:'ignore'}).unref();
console.log('Opening '+url);
