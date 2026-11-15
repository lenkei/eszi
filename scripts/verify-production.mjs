/** Start the production build in this process environment, verify it, and stop it. */
import {spawn} from 'node:child_process';
import {setTimeout} from 'node:timers/promises';
const port=process.env.PORT||'3100';
const server=spawn(process.execPath,['node_modules/next/dist/bin/next','start','-H','127.0.0.1','-p',port],{stdio:['ignore','pipe','pipe'],env:{...process.env,NEXT_TELEMETRY_DISABLED:'1'}});
let logs='';server.stdout.on('data',d=>{logs+=d});server.stderr.on('data',d=>{logs+=d});
process.env.CHECK_BASE_URL=`http://127.0.0.1:${port}`;
try{let ready=false;for(let i=0;i<40;i++){try{const r=await fetch(process.env.CHECK_BASE_URL);if(r.ok){ready=true;break;}}catch{}await setTimeout(250);}if(!ready)throw new Error('Production server did not start. '+logs);await import('./check-site.mjs');}finally{server.kill('SIGTERM');}
