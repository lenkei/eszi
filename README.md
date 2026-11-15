# ESZI – Energetikai Technikum és Kollégium

Az eszi.hu új, reszponzív Next.js-oldala az elfogadott főoldalterv alapján. Sötétkék és fehér felületek, ESZI-kék gombok, lime kiemelések; a nagy iskolakép a nyitóoldal közepén jelenik meg.

## Futtatás

Node.js 22.18 vagy újabb szükséges (a TypeScript-alapú tesztekhez is).

```bash
npm ci
npm run dev
```

A fejlesztői oldal: http://localhost:3000.

```bash
npm test
npm run typecheck
npm run build
npm start
```

A futó production szerveren a `npm run check:site` minden implementált útvonalat ellenőriz HTTP-n; a 404-et és az ékezet nélküli keresést is vizsgálja. Eltérő címmel: `CHECK_BASE_URL=https://preview.example.hu npm run check:site`.

## Megvalósított oldalak

- Teljes főoldal, középre helyezett nagy képpel, látogatói gyorslinkekkel, képzésekkel, hírekkel és diákélettel.
- Összes eredeti főmenü: Iskolánkról, Jelentkezőknek, Vizsgák, Dokumentumtár, Szülő-diák, Fenntartó. A fejléc Tudnivalók menüjéből is elérhetők a kapcsolódó csoportok.
- Az eredeti menük aloldalai és a forrásból elérhető archív oldalak, eredeti URL-jeikkel.
- Galéria: tanévek és események saját útvonalon, reszponzív képráccsal. A nagy képek és ZIP-letöltések eredeti hivatkozásai megmaradnak.
- Hét külön képzésoldal a 2027/2028-as beiskolázási tájékoztató adataival.
- Új gyűjtőoldalak: Diákoknak, Szülőknek, Diákélet, Csengetési rend, Nyílt nap, Oldaltérkép.
- Működő hozottpont-kalkulátor az eredeti intézményi súlyozással, képzésenként 80 pontos maximummal.
- Szerveroldali, ékezetfüggetlen keresés. A tartalomjegyzék és a teljes archívum nem kerül kliensoldali keresőcsomagba.
- Kompakt mobilfejléc, lenyíló menücsoportok, külön nyitható aloldalnavigáció, natív accordionok, oldalirányban görgethető táblázatok.
- Egyedi metaadatok, sitemap, robots, favicon és 404-oldal.

## Tartalom és frissítés

A migráció 2026. november 15-i tartalompillanatképet használ. A tisztított oldalak a `content/pages.json` fájlban, a keresőindex a `content/search-index.json` fájlban vannak. A `content/source-manifest.json` felsorolja a ténylegesen átvett forrásokat. Az archív adatok dátumait és megnevezéseit megtartottuk; azokat nem szabad aktuális tájékoztatásként átírni.

A főoldal aktuális hírei és a nyílt nap kiemelése az `app/page.tsx`, illetve `components/CustomPages.tsx` fájlban szerkeszthetők. A képzésadatok: `lib/courses.ts`. A kalkulátor szabályai: `lib/admissions.ts`. Nincs CMS vagy automatikus hírszinkron; a módosítások után új build szükséges.

Az eredeti HTML-ből a JavaScriptet, inline stílusokat és eseménykezelőket eltávolító egyszeri migráció újrafuttatható:

```bash
python3 -m pip install -r scripts/requirements.txt
python3 scripts/crawl_source.py
python3 scripts/crawl_gallery.py
python3 scripts/prepare-content.py
```

A forrásletöltések a repó melletti `source-cache/` mappába kerülnek. A napi működéshez Python és a régi webhely elérése nem szükséges az oldal HTML-jének előállításához.

## Képek, dokumentumok és élesítés

A főoldal képe helyi, optimalizált WebP, a régi fejlécben lévő épületfotó kivágata. A kapott forrás alacsony felbontása miatt a végleges élesítéshez érdemes ugyanerről az épületről nagyobb, eredeti fényképre cserélni. Az `eszi` felirat a jóváhagyott terv szerinti tipográfiai jelölés; hivatalos logófájllal lecserélhető.

**A letölthető intézményi dokumentumok és az archív galéria képei jelenleg az eredeti `https://www.eszi.hu` kiszolgálóról töltődnek.** Ezek bináris fájljai nem kerültek ebbe a Git-repóba. Új Vercel-előnézeten a hivatkozások tovább működnek. Az eszi.hu domain átirányítása előtt a régi `/static`, `/kepek` és más hivatkozott fájloknak az eredeti útvonalaikon továbbra is elérhetőnek kell maradniuk, vagy át kell őket vinni tartós tárhelyre, és az URL-eket módosítani kell. Ez a teljes domainváltás előfeltétele.

A KRÉTA, az EduPage órarend, az ebédrendelés, a munkaterv és az Outlook-naptár továbbra is az intézmény meglévő külső rendszerét nyitják meg. Nem hoztunk létre saját bejelentkezést, rendelési vagy adatbekérő űrlapot. A videók kattintásra külső oldalon nyílnak meg, beágyazott videó nem lassítja a betöltést.

Vercel: a repó gyökere legyen a projekt gyökere; framework **Next.js**, build `npm run build`, install `npm ci`, output az alapértelmezett. Saját éles URL-nél állítsd be a `NEXT_PUBLIC_SITE_URL` változót. A repóba küldés önmagában nem állít át domaint és nem jelent élesítést.

## Teljesítmény és ellenőrzések

A főoldal és a tartalmi aloldalak előre renderelt HTML-ként készülnek, csak a kereső szerveroldali lekérdezése dinamikus. A tartalom és a régi galéria HTML-je szerveroldalon marad. Nincsenek általános animációs vagy UI-csomagok; az interaktív részek kis React-komponensek.

A GitHub Actions minden main-push és pull request esetén buildet, egységteszteket, útvonal-ellenőrzést és Playwright-böngészőteszteket futtat. A böngészőtesztek 320, 390, 768 és 1440 px szélességen vizsgálják a főoldalt, illetve a menü és a kalkulátor működését; a képernyőképek a `browser-test-results` artifactban érhetők el. Helyben: `npx playwright install chromium`, majd `npm run test:e2e`.

A tesztek a kalkulátor súlyozását, a hiányos jegyek kezelését, a belső hivatkozásokat, a főmenük tartalmát és az importált HTML tisztítását ellenőrzik. A sebességhez nem állítunk be nem mért Lighthouse-pontszámot.
