#!/usr/bin/env python3
"""Sanitize the captured legacy content. No source scripts or inline styles ship."""
from pathlib import Path
from bs4 import BeautifulSoup,Comment,ProcessingInstruction,Declaration
from urllib.parse import urljoin,urlsplit,urlunsplit
import json,re
ROOT=Path(__file__).resolve().parents[1];CACHE=ROOT.parent/'source-cache';BASE='https://www.eszi.hu/'
titles={'fenntarto':'ESZI Alapítvány','hirek':'Hírek','galeria':'Galéria','bemutatkozo':'Bemutatkozás','alapdokumentumok':'Alapdokumentumok','felvetelikalkulator':'Felvételi pontszámító'}
pages={}; navigation={};localpaths=set()
for f in CACHE.glob('*.html'):
 localpaths.add(f.stem.replace('__','/'))
# keep intentional locally-built pages local too
localpaths|={'kepzesek','diakelet','diakok','szulok','nyilt-nap','kereses','csengetesi-rend'}
def href(h):
 h=h.strip().replace('www.eszi.local','www.eszi.hu')
 if h.startswith('#'):return h
 u=urlsplit(urljoin(BASE,h))
 if u.scheme not in ['http','https','mailto','tel','webcal']:return None
 if u.hostname in ['eszi.hu','www.eszi.hu']:
  path=u.path.strip('/')
  if not path:return '/'
  if path in localpaths:return '/'+path+('?' +u.query if u.query else '')+('#'+u.fragment if u.fragment else '')
  return urlunsplit(('https','www.eszi.hu',u.path,u.query,u.fragment))
 return h if u.scheme in ['mailto','tel','webcal'] else urlunsplit(u)
for f in sorted(CACHE.glob('*.html')):
 slug=f.stem.replace('__','/');s=BeautifulSoup(f.read_text(),'html.parser');c=s.select_one('#content')
 if not c:continue
 if slug.startswith('galeria/esemeny/'):
  gallery=s.select_one('#gallery')
  if gallery and not c.select_one('#gallery'):c.append(gallery.extract())
 nav=[]
 for a in s.select('#contentmenu a[href]'):
  nav.append({'label':re.sub(r'\s+',' ',a.get_text(' ',strip=True)).replace('Közösségi szolgálat','Közösségi szolgálat'),'href':href(a['href'])})
 navigation[slug]=nav
 h=c.find('h1');title=titles.get(slug,h.get_text(' ',strip=True) if h else slug.replace('-',' ').capitalize())
 if slug.startswith('galeria/tanev/'):
  sub=c.find('h4');title=sub.get_text(' ',strip=True) if sub else 'Galéria'
 for headline in list(c.find_all('h1')):headline.decompose()
 # Native, keyboard-operable accordions replace the legacy JavaScript hide/show blocks.
 for el in list(c.find_all(id=re.compile(r'^tartalom\d+short$'))):el.decompose()
 for i,el in enumerate(list(c.find_all(id=re.compile(r'^tartalom\d+long$')))):
  head=el.find('h4');a=head.parent if head else None
  if head:
   titletext=head.get_text(' ',strip=True).lstrip('▼► ').strip()
   if a and a.name=='a':a.decompose()
   else:head.decompose()
   el.name='details';el['class']=['content-accordion'];summary=s.new_tag('summary');summary.string=titletext;el.insert(0,summary)
   if i==0:el['open']=''
 for el in list(c.select('script,style,head,meta,link,object,embed,noscript')):el.decompose()
 for el in list(c.find_all(string=lambda x:isinstance(x,(Comment,ProcessingInstruction,Declaration)))):el.extract()
 for frame in list(c.select('iframe')):
  url=href(frame.get('src',''))
  a=s.new_tag('a',href=url or BASE+slug);a['class']=['embed-link'];a.string='Videó / külső tartalom megnyitása ↗';frame.replace_with(a)
 for a in list(c.select('a')):
  url=href(a.get('href',''))
  if url is None:a.unwrap();continue
  a['href']=url
  if url.startswith('http'):a['target']='_blank'
  if a.get('target')=='_blank':a['rel']='noopener noreferrer'
  if re.search(r'\.(pdf|docx?|xlsx?|zip|pptx?)(?:[?#]|$)',url,re.I):a['class']=['document-link']
  # Image-only links should have a usable accessible name even when the source has none.
  if not a.get_text(strip=True):
   im=a.find('img');name=(im.get('alt') or im.get('title')) if im else None
   if not name:name=urlsplit(url).path.rsplit('/',1)[-1].replace('_',' ')
   a['aria-label']=name or 'Megnyitás'
 for img in list(c.select('img')):
  src=img.get('src','')
  if '/styles/files/' in src:img.decompose();continue
  img['src']=urljoin(BASE,src).replace('http://www.eszi.hu','https://www.eszi.hu')
  img['alt']=img.get('alt') or img.get('title') or ('ESZI – '+title)
  img['loading']='lazy';img['decoding']='async'
  if '/static/kreta' in src:
   img.replace_with(BeautifulSoup('<span>Belépés a KRÉTA rendszerbe ↗</span>','html.parser'))
 # Remove source layout and all executable / unsafe attributes.
 for el in c.find_all(True):
  allowed={'a':{'href','title','target','rel','aria-label'},'img':{'src','alt','loading','decoding'},'td':{'colspan','rowspan'},'th':{'colspan','rowspan','scope'},'details':{'open'},'ol':{'start'},'select':{'name'},'option':{'value'}}.get(el.name,set())|{'id','class'}
  for key in list(el.attrs):
   if key not in allowed:del el[key]
  if el.name=='h4':el.name='h2';el.string=el.get_text(' ',strip=True).lstrip('▼► ')
  if el.name in ['font','center']:el.name='div'
  if el.name=='table':
   wrapper=s.new_tag('div');wrapper['class']=['table-scroll'];wrapper['tabindex']='0';wrapper['role']='region';wrapper['aria-label']='Görgethető táblázat';el.wrap(wrapper)
 if slug=='hirek':
  news=c.select('.newsshort')
  if len(news)>1:news[1]['id']='tamogatas'
 # Convert all gallery layout tables into genuine responsive card/photo grids.
 if slug.startswith('galeria'):
  gallery=c.select_one('#gallery')
  if gallery:
   gallery['class']=['gallery-grid']
   for a in gallery.select('a[href]'):a['class']=['gallery-card']
  for table in list(c.select('table')):
   grid=s.new_tag('div');grid['class']=['gallery-grid']
   for a in list(table.select('a[href]')):
    if a.find('img'):
     a['class']=['gallery-card'];grid.append(a.extract())
   if grid.contents:table.parent.replace_with(grid)
 if slug=='felvetelikalkulator':c.clear() # replaced by typed React calculator
 html=c.decode_contents().replace("www.eszi.local","www.eszi.hu")
 text=c.get_text(' ',strip=True)
 text=re.sub(r'\s+',' ',text)
 pages[slug]={'slug':slug,'title':title,'html':html,'description':(text[:160] if text else title+' – Energetikai Technikum és Kollégium, Paks.'),'source':BASE+slug,'navigation':nav}
(ROOT/'content'/'pages.json').write_text(json.dumps(pages,ensure_ascii=False,indent=2))
# Compact index is the only content used by client-side search.
(ROOT/'content'/'search-index.json').write_text(json.dumps([{'slug':p['slug'],'title':p['title'],'text':re.sub('<[^>]*>',' ',p['html'])[:3500]} for p in pages.values() if not p['slug'].startswith('galeria/esemeny/')],ensure_ascii=False))
(ROOT/'content'/'source-manifest.json').write_text(json.dumps({'capturedAt':'2026-11-15','pages':[{'slug':p['slug'],'title':p['title'],'source':p['source']} for p in pages.values()],'failed':[]},ensure_ascii=False,indent=2))
print('Prepared',len(pages),'pages')
