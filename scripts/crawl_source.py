#!/usr/bin/env python3
"""Download the legacy navigation pages for a reproducible content migration."""
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path
from urllib.parse import urljoin, urlsplit, unquote
from urllib.request import urlopen, Request
from bs4 import BeautifulSoup
import json, re, time
ROOT=Path(__file__).resolve().parents[1]
CACHE=ROOT.parent/'source-cache'; CACHE.mkdir(exist_ok=True)
BASE='https://www.eszi.hu/'
seeds=['hirek','kapcsolat','kreta','ebedrendeles','galeria','nyelvvizsga','versenyeredmenyek','bemutatkozo','jelentkezes','alapvizsga','alapdokumentumok','tajekoztatok','fenntarto','hirarchivum']

def fetch(slug):
 f=CACHE/(slug+'.html')
 if f.exists(): return slug,f.read_text()
 for i in range(3):
  try:
   with urlopen(Request(BASE+slug,headers={'User-Agent':'ESZI-website-migration/1.0'}),timeout=35) as r:
    data=r.read().decode('utf-8-sig'); f.write_text(data);return slug,data
  except Exception as e:
   if i==2: return slug,None
 return slug,None

def local_links(s):
 out=set()
 for a in s.select('a[href]'):
  u=urlsplit(urljoin(BASE,a['href'].replace('www.eszi.local','www.eszi.hu')))
  p=u.path.strip('/')
  if u.hostname in ['eszi.hu','www.eszi.hu'] and re.fullmatch(r'[a-z0-9_-]+',p) and not u.query: out.add(p)
 return out
pages={}; pending=set(seeds); failed=[]
while pending:
 batch=sorted(pending);pending=set()
 with ThreadPoolExecutor(max_workers=8) as pool:
  for future in as_completed([pool.submit(fetch,x) for x in batch]):
   slug,html=future.result()
   if not html: failed.append(slug);continue
   s=BeautifulSoup(html,'html.parser'); content=s.select_one('#content')
   if not content: failed.append(slug);continue
   title=content.find('h1');pages[slug]={'slug':slug,'title':title.get_text(' ',strip=True) if title else slug,'html':str(content),'source':BASE+slug}
   pending|=local_links(s)-pages.keys()-set(batch)-set(failed)
 print('Loaded',len(pages),'next',sorted(pending),'failed',failed,flush=True)
 if len(pages)>140: break
(ROOT/'content'/'source-pages.json').write_text(json.dumps(pages,ensure_ascii=False,indent=2))
(ROOT/'content'/'source-manifest.json').write_text(json.dumps({'capturedAt':time.strftime('%Y-%m-%d'),'pages':[{k:p[k] for k in ['slug','title','source']} for p in pages.values()],'failed':failed},ensure_ascii=False,indent=2))
