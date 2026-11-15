#!/usr/bin/env python3
from concurrent.futures import ThreadPoolExecutor,as_completed
from pathlib import Path
from urllib.request import urlopen
from urllib.parse import urljoin,urlsplit
from bs4 import BeautifulSoup
import json,re
ROOT=Path(__file__).resolve().parents[1];CACHE=ROOT.parent/'source-cache';BASE='https://www.eszi.hu/'
def links(html):
 s=BeautifulSoup(html,'html.parser');out=set()
 for a in s.select('#content a[href]'):
  u=urlsplit(urljoin(BASE,a['href']));p=u.path.strip('/')
  if u.hostname in ['eszi.hu','www.eszi.hu'] and re.fullmatch(r'galeria/(?:tanev|esemeny)/[a-z0-9]+',p):out.add(p)
 return out
def get(p):
 f=CACHE/(p.replace('/','__')+'.html')
 for i in range(2):
  try:
   if f.exists(): return p,f.read_text()
   with urlopen(BASE+p,timeout=30) as r:html=r.read().decode('utf-8-sig')
   f.write_text(html);return p,html
  except Exception as e:
   if i: return p,None
pages={};failed=[];pending=links((CACHE/'galeria.html').read_text())
while pending:
 batch=pending;pending=set()
 with ThreadPoolExecutor(max_workers=10) as pool:
  for fut in as_completed([pool.submit(get,p) for p in batch]):
   p,html=fut.result()
   if html:
    s=BeautifulSoup(html,'html.parser');c=s.select_one('#content');h=c.find('h4') if c else None
    if c: pages[p]={'slug':p,'title':h.get_text(' ',strip=True) if h else 'Galéria','html':str(c),'source':BASE+p}
    pending|=links(html)-pages.keys()-set(batch)-set(failed)
   else:failed.append(p)
 print('Gallery',len(pages),'next',len(pending),'failed',failed,flush=True)
(ROOT/'content'/'source-gallery.json').write_text(json.dumps(pages,ensure_ascii=False,indent=2))
