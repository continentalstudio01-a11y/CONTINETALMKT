import { readFile, writeFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const dist=path.join(root,'dist');
const styles=await Promise.all(['base.css','brand.css','enhancements.css'].map(async name=>'/* '+name+' */\n'+await readFile(path.join(root,'styles',name),'utf8')));
await writeFile(path.join(dist,'continental.css'),styles.join('\n'));
const packageHTML=await readFile(path.join(dist,'pacotes/index.html'),'utf8');
const data=JSON.parse(await readFile(path.join(dist,'support-data.json'),'utf8'));
for(const [slug,item] of Object.entries(data.services)){
 const start=packageHTML.indexOf('data-offer="'+slug+'"');
 if(start<0)throw new Error('Missing offer: '+slug);
 const end=packageHTML.indexOf('data-offer="',start+12);
 const block=packageHTML.slice(start,end<0?undefined:end);
 const price=block.match(/<div class="offer-amount">([\s\S]*?)<\/div>/);
 item.price=price?price[1].replace(/<[^>]*>/g,' ').replace(/&nbsp;/g,' ').replace(/\s+/g,' ').trim():'Valores sob consulta';
}
await writeFile(path.join(dist,'support-data.json'),JSON.stringify(data)+'\n');
const home=await readFile(path.join(dist,'index.html'),'utf8');
const currentOrigin=new URL(home.match(/<link rel="canonical" href="([^"]+)"/)[1]).origin;
const requested=process.env.SITE_URL||process.env.VERCEL_PROJECT_PRODUCTION_URL||process.env.VERCEL_URL||currentOrigin;
const url=new URL(requested.includes('://')?requested:'https://'+requested);
if(url.protocol!=='https:'||url.username||url.password||url.pathname!=='/'||url.search||url.hash)throw new Error('SITE_URL must be a plain HTTPS origin.');
const origin=url.origin;
async function visit(dir){
 for(const item of await readdir(dir,{withFileTypes:true})){
  const file=path.join(dir,item.name);
  if(item.isDirectory()){await visit(file);continue;}
  if(!/\.(html|json|xml|txt)$/.test(item.name))continue;
  let text=await readFile(file,'utf8');text=text.split(currentOrigin).join(origin);
  if(item.name.endsWith('.html')){
   text=text.replace(/<meta name="robots" content="noindex, nofollow" data-vercel-preview="true">/g,'');
   if(process.env.VERCEL_ENV==='preview')text=text.replace('</head>','<meta name="robots" content="noindex, nofollow" data-vercel-preview="true"></head>');
  }
  await writeFile(file,text);
 }
}
await visit(dist);
console.log('Built static site: dist/; canonical origin: '+origin);
