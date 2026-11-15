import {createServer} from 'node:http';
import {readFile,stat,mkdir} from 'node:fs/promises';
import {resolve,relative,extname,dirname,sep} from 'node:path';
import {fileURLToPath} from 'node:url';
import {webcrypto} from 'node:crypto';
import {openDatabase} from './server/database.mjs';
import {configureDatabase,authGet,authPost,workspaceGet,workspacePut,failure,loadState} from './server/api.mjs';
if(!globalThis.crypto)globalThis.crypto=webcrypto;
const root=dirname(fileURLToPath(import.meta.url));const port=Number(process.env.PORT||4175);
if(!Number.isInteger(port)||port<1024||port>65535)throw Error('PORT must be between 1024 and 65535.');
const localHosts = new Set([`127.0.0.1:${port}`, `localhost:${port}`]);
const localOrigins = new Set([...localHosts].map(host => `http://${host}`));
const {CODESPACES, CODESPACE_NAME, GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN} = process.env;
const previewHost = CODESPACES === 'true' && CODESPACE_NAME && GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN
  ? `${CODESPACE_NAME}-${port}.${GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN}`
  : null;
const previewOrigin = previewHost ? `https://${previewHost}` : null;
const dataDir=resolve(process.env.RESULT_DATA_DIR||resolve(root,'data'));await mkdir(dataDir,{recursive:true,mode:0o700});
const database=openDatabase(resolve(dataDir,'results.sqlite'),resolve(root,'drizzle'));configureDatabase(database);await loadState();
const publicRoot=resolve(root,'public');const media={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.svg':'image/svg+xml','.png':'image/png','.jpg':'image/jpeg','.woff2':'font/woff2','.ico':'image/x-icon'};
const http=createServer(async(req,res)=>{try{
 const host = req.headers.host || '';
 const isLocal = localHosts.has(host);
 const isPreview = previewHost !== null && (host === previewHost || (isLocal && req.headers['x-forwarded-host'] === previewHost));
 if(!isLocal && !isPreview){res.writeHead(403);res.end('Invalid host.');return;}
 const requestOrigin = isPreview ? previewOrigin : `http://${host}`;
 const url = new URL(req.url || '/', requestOrigin);
 if(url.origin !== requestOrigin){res.writeHead(403);res.end('Invalid request URL.');return;}
 res.setHeader('X-Content-Type-Options','nosniff');res.setHeader('Referrer-Policy','same-origin');res.setHeader('X-Frame-Options','DENY');
 if(url.pathname==='/api/health'){res.writeHead(200,{'Content-Type':'application/json','Cache-Control':'no-store'});res.end(JSON.stringify({ok:true,application:'result-processing-system'}));return;}
 if(url.pathname==='/api/auth'||url.pathname==='/api/workspace'){
  const method=req.method||'GET';const allowed=url.pathname==='/api/auth'?['GET','POST']:['GET','PUT'];if(!allowed.includes(method)){res.writeHead(405,{'Allow':allowed.join(', ')});res.end();return;}
  const headers=new Headers();for(const [name,value] of Object.entries(req.headers))if(value!==undefined)headers.set(name,Array.isArray(value)?value.join(', '):value);
  // Codespaces can rewrite a browser's Origin to the internal loopback URL.
  if(isPreview && localOrigins.has(headers.get('origin'))){
   const fetchSite = headers.get('sec-fetch-site');
   const referer = headers.get('referer');
   const sameOriginReferer = referer && URL.canParse(referer) && new URL(referer).origin === previewOrigin;
   if(fetchSite === 'same-origin' || (fetchSite === null && sameOriginReferer)) headers.set('origin', previewOrigin);
  }
  let bytes=0;const parts=[];for await(const part of req){bytes+=part.length;if(bytes>8_000_000){res.writeHead(413);res.end('Request too large.');return;}parts.push(part);}
  const request=new Request(url,{method,headers,...(method==='GET'?{}:{body:Buffer.concat(parts)})});
  let response;try{response=url.pathname==='/api/auth'?(method==='GET'?await authGet(request):await authPost(request)):(method==='GET'?await workspaceGet(request):await workspacePut(request));}catch(e){response=failure(e);}
  for(const [key,value] of response.headers)res.setHeader(key,value);res.writeHead(response.status);res.end(Buffer.from(await response.arrayBuffer()));return;
 }
 if(req.method!=='GET'&&req.method!=='HEAD'){res.writeHead(405);res.end();return;}
 let pathname;try{pathname=decodeURIComponent(url.pathname);}catch{res.writeHead(400);res.end();return;}
 if(pathname.includes('\\')||pathname.includes('\0')){res.writeHead(400);res.end();return;}
 const filename=resolve(publicRoot,'.'+(pathname==='/'?'/index.html':pathname));const rel=relative(publicRoot,filename);
 if(rel.startsWith('..'+sep)||rel==='..'){res.writeHead(403);res.end();return;}
 try{if(!(await stat(filename)).isFile())throw Error();const bytes=await readFile(filename);res.writeHead(200,{'Content-Type':media[extname(filename)]||'application/octet-stream','Cache-Control':extname(filename)==='.html'?'no-store':'public, max-age=3600'});res.end(req.method==='HEAD'?undefined:bytes);}catch{res.writeHead(404,{'Content-Type':'text/plain'});res.end('Page not found.');}
}catch(e){console.error('Request error:',e.message);if(!res.headersSent)res.writeHead(500,{'Content-Type':'text/plain'});res.end('The request could not be completed.');}});
http.listen(port,'127.0.0.1',()=>console.log(`\nResult Processing System is running:\n${previewOrigin || `http://127.0.0.1:${port}`}/\n\nDatabase: ${resolve(dataDir,'results.sqlite')}\nKeep this window open. Press Ctrl+C to stop.\n`));
http.on('error',e=>{console.error(e.code==='EADDRINUSE'?`Port ${port} is already in use. Open http://127.0.0.1:${port}/ or set another PORT.`:e.message);database.close();process.exitCode=1;});
function stop(){http.close(()=>{database.close();process.exit(0);});setTimeout(()=>process.exit(0),2000).unref();}process.on('SIGINT',stop);process.on('SIGTERM',stop);
