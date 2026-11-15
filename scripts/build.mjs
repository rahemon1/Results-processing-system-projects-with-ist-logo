import {build} from 'vite';
import tailwind from '@tailwindcss/postcss';
import {fileURLToPath} from 'node:url';
import {resolve} from 'node:path';
import {copyFile} from 'node:fs/promises';
const root=fileURLToPath(new URL('..',import.meta.url));process.chdir(root);
await build({configFile:false,root,define:{'process.env.NODE_ENV':JSON.stringify('production'),'__IST_OFFLINE__':'false'},css:{postcss:{plugins:[tailwind()]}},publicDir:false,build:{outDir:'public',emptyOutDir:true,target:'es2020',minify:false,sourcemap:true,rollupOptions:{input:resolve(root,'index.html')}}});
await build({configFile:false,root,plugins:[{name:'node-database-binding',enforce:'pre',resolveId(id){if(id==='cloudflare:workers')return '\0node-database';},load(id){if(id==='\0node-database')return 'let db; export const env={get DB(){return db;}}; export function configureDatabase(value){db=value;}';}}],ssr:{noExternal:true},build:{ssr:'server/api-entry.ts',outDir:'server/generated',emptyOutDir:true,minify:false,sourcemap:true,rollupOptions:{output:{entryFileNames:'api.mjs',inlineDynamicImports:true}}}});
await copyFile(resolve(root,'server/generated/api.mjs'),resolve(root,'server/api.mjs'));await copyFile(resolve(root,'server/generated/api.mjs.map'),resolve(root,'server/api.mjs.map'));console.log('Built frontend and SQLite backend. Startup needs no npm install.');
