# Kód- és biztonsági felülvizsgálat – 2026. november 15.

Az ellenőrzés a repó alkalmazáskódjára, tartalomimportjára, függőségeire és CI-folyamatára terjedt ki. Az eredeti eszi.hu tárhelyét és a külső iskolai rendszereket nem teszteltük behatolással.

## Talált problémák és javítások

| Terület | Megállapítás | Javítás |
|---|---|---|
| Importált HTML | A megjelenítés közvetlenül megbízott a JSON HTML-jében; az importáló tiltólistája nem zárt ki minden HTML-elemet és képprotokollt. Hibás vagy kompromittált forrás, illetve kézi tartalommódosítás esetén kódbefecskendezési lehetőség állt fenn. A jelenlegi tartalomban nem találtunk aktív támadó kódot. | DOMPurify + naprakész JSDOM szűrés közvetlenül a megjelenítés előtt, engedélyezett tagek/attribútumok, ellenőrzött URL-protokollok, csak ESZI HTTPS képek, tiltott űrlapok/beágyazások/SVG/MathML/eseménykezelők. |
| Böngészővédelem | Hiányzó CSP, korlátozott keretbe ágyazás elleni védelem. | CSP: külső szkriptek, inline eseménykezelők, iframe/object, base-átírás és külső űrlapküldés tiltása; DENY keretvédelem és HSTS. |
| Menü | Az Escape mindig a rejtett mobilgombra próbált fókuszálni, nyitott menü nélkül is. | Csak nyitott menüt zár; a tényleges nyitógombra teszi vissza a fókuszt. Az aktuális oldalra mutató almenücím is bezárja a panelt. |
| Kalkulátor | Hibás tömbhossz vagy ritkás osztályzattömb esetén NaN-eredmény keletkezhetett; nem tömb érték hibát okozhatott. A normál felület ezt nem állítja elő. | Pontosan két, 2–5 közötti egész jegy ellenőrzése. |
| Kereső | Kérésenként és keresőszavanként újranormalizálta a tartalmat; csak kombináló ékezetből álló keresés minden dokumentumra illeszkedett. A találatszám 60-nál pontatlan volt. | Előfeldolgozott szerveroldali index, egyedi keresőszavak, üres normalizált lekérdezés kizárása, pontos találatszám. A meglévő 200 karakteres korlát megmaradt. |
| Kanonikus URL-ek | Záró perjeles környezeti beállítás dupla perjeles sitemap URL-eket generált. | Egységes, validált webes origin a metadata, sitemap és robots számára. |
| Ellenőrzések | A CI nem ellenőrizte a függőségek sérülékenységi adatbázisát. | `npm audit --audit-level=low`, HTML/URL támadási minták, CSP-, XSS-, fókusz- és hibásbemenet-regressziós tesztek. |

## Ellenőrzés és korlátok

- A javítások után `npm audit`: 0 ismert sérülékenység a teljes függőségi fában. Ez az adatbázis adott időpontban ismert találatait jelenti, nem teljes biztonsági garanciát.
- A verziózott fájlok gyakori titok-/kulcsmintáinak ellenőrzése nem adott találatot; ez nem teljes körű titokdetektálás.
- Nincs saját bejelentkezés, adatbázis, szerveroldali írási API vagy Server Action. A KRÉTA és egyéb ügyintézés külső rendszerekre mutat. Ezek biztonságát ez az ellenőrzés nem minősíti.
- A statikus Next.js-oldalak hidratálásához a CSP `script-src 'unsafe-inline'` engedélye megmarad. A CSP ezért nem önálló, teljes XSS-védelem: az elsődleges határ a megjelenítés előtti szűrés. Nincs production `unsafe-eval`; az inline eseménykezelőket külön `script-src-attr 'none'` tiltja. A nonce-alapú teljes védelem dinamikus renderelést igényelne; a gyors statikus oldalak megmaradtak.
- A HSTS csak HTTPS-kapcsolaton érvényesül; nincs `includeSubDomains` vagy preload, így nem kényszeríti át az intézmény más szolgáltatásait. A TLS- és HTTP→HTTPS átirányítást az éles tárhelyen külön ellenőrizni kell.
- A dokumentumok és archív képek továbbra is az eredeti tárhelyről érkeznek. A domain átállítása előtt ezeket át kell költöztetni vagy tartósan elérhetővé kell tenni. Az engedélyezett képhostot költözéskor a szűrőben és CSP-ben együtt kell frissíteni.
- A keresőnek nincs alkalmazásszintű, elosztott forgalomkorlátozása. Az éles szolgáltató WAF-/rate-limit szabályai és a terhelés alatti viselkedés nincsenek ebben a repóellenőrzésben igazolva.

## Megismételhető ellenőrzés

Node.js: aktuális 24 LTS (legalább 24.15); a `.nvmrc` ezt választja. A JSDOM miatt a korábbi 22.18 minimum már nem elegendő.

```sh
npm ci
npm audit --audit-level=low
npm test
npm run build
npm run typecheck
npm run verify
npx playwright install --with-deps chromium
npm run test:e2e
```

Szakmai referencia: [DOMPurify szerveroldali használat](https://github.com/cure53/DOMPurify), [Next.js CSP](https://nextjs.org/docs/app/guides/content-security-policy), [Next.js biztonsági közlemények](https://github.com/vercel/next.js/security/advisories).
