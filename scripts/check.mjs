import {readdir,readFile,stat} from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..','dist');
let pages=0;const titles=new Set();
async function walk(dir){for(const entry of await readdir(dir,{withFileTypes:true})){
 const filename=path.join(dir,entry.name);if(entry.isDirectory()){await walk(filename);continue;}
 if(!entry.name.endsWith('.html'))continue;
 pages++;const html=await readFile(filename,'utf8');assert.equal((html.match(/<h1\b/g)||[]).length,1,filename);
 const title=html.match(/<title>(.*?)<\/title>/s)?.[1];assert(title&&!titles.has(title),'Missing or repeated title');titles.add(title);
 assert.equal((html.match(/<link rel="canonical"/g)||[]).length,1);
 for(const match of html.matchAll(/(?:src|href)="(\/[^"?#]*)(?:[?#][^"]*)?"/g)){
  let target=path.join(root,decodeURI(match[1]));const info=await stat(target);if(info.isDirectory())target=path.join(target,'index.html');assert((await stat(target)).isFile(),target);
 }
 for(const match of html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/gs))JSON.parse(match[1]);
}}
await walk(root);assert(pages>=13);
const services=JSON.parse(await readFile(path.join(root,'support-data.json'),'utf8')).services;assert.equal(Object.keys(services).length,7);for(const item of Object.values(services))assert(item.price&&!item.price.includes('undefined'));
const config=JSON.parse(await readFile(path.join(root,'..','vercel.json'),'utf8'));assert.equal(config.outputDirectory,'dist');assert(!config.rewrites,'MPA should use filesystem routing');
console.log('PASS: '+pages+' pages, unique titles, canonicals, local assets, schemas, seven assistant offers and Vercel configuration.');
