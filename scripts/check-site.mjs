/** Run after npm run build && npm start. Checks every generated route over HTTP. */
import {readFile} from 'node:fs/promises';
const base=process.env.CHECK_BASE_URL||'http://localhost:3000';
const pages=JSON.parse(await readFile(new URL('../content/pages.json',import.meta.url),'utf8'));
const extras=['/','/kepzesek','/diakelet','/diakok','/szulok','/nyilt-nap','/csengetesi-rend','/oldalterkep','/kereses?q=felveteli','/kepzesek/gepeszet','/kepzesek/informatika','/kepzesek/elektronika','/kepzesek/penzugy','/kepzesek/kornyezetvedelem','/kepzesek/ipari-informatika','/kepzesek/mechatronika'];
const paths=[...new Set([...Object.keys(pages).map(p=>'/'+p),...extras])];let next=0;const failures=[];let totalBytes=0;
async function work(){while(next<paths.length){const path=paths[next++];try{const r=await fetch(base+path);const text=await r.text();totalBytes+=Buffer.byteLength(text);if(r.status!==200)failures.push(`${path}: HTTP ${r.status}`);if((text.match(/<h1(?:\s|>)/g)||[]).length!==1)failures.push(`${path}: expected exactly one h1`);if(!text.includes('<html lang="hu"'))failures.push(`${path}: missing Hungarian language`);if(/www\.eszi\.local/.test(text))failures.push(`${path}: bad legacy hostname`);}catch(e){failures.push(`${path}: ${e.message}`);}}}
await Promise.all(Array.from({length:8},work));
const missing=await fetch(base+'/ez-az-oldal-nem-letezik');if(missing.status!==404)failures.push('Unknown route must return 404');
const search=await(await fetch(base+'/kereses?q=felveteli')).text();if(!search.includes('találat erre'))failures.push('Accent-insensitive search returned no result');
const js=(await(await fetch(base+'/')).text()).match(/src="([^" ]+\.js[^" ]*)"/g)||[];
console.log(JSON.stringify({checkedRoutes:paths.length,unknownRoute:missing.status,averageHtmlBytes:Math.round(totalBytes/paths.length),homeScriptTags:js.length,failures},null,2));if(failures.length)process.exitCode=1;
