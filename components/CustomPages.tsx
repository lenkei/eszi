import Link from "next/link";
import { CourseGrid } from "./CourseGrid";
import { Arrow } from "./Icons";
import { Calculator } from "./Calculator";
import { courses } from "@/lib/courses";
import {
  groups,
  quickLinks,
  calendar,
  workplan,
  timetable,
} from "@/lib/navigation";
import { pages } from "@/lib/content";
export const customTitles: Record<string, string> = {
  kepzesek: "Képzéseink",
  diakelet: "Élet az ESZI-ben",
  diakok: "Diákoknak",
  szulok: "Szülőknek",
  "nyilt-nap": "Nyílt nap az ESZI-ben",
  "csengetesi-rend": "Csengetési rend",
  oldalterkep: "Oldaltérkép",
  felvetelikalkulator: "Felvételi pontszámító",
};
export const customDescriptions: Record<string, string> = {
  kepzesek:
    "Hét tanulmányi terület, sokféle lehetőség. Ismerd meg a 2027/2028-as tanévben induló képzéseinket.",
  diakelet:
    "Az ESZI több mint tantermek és tanórák: közös élmények, sport és egy összetartó közösség.",
  diakok: "A mindennapi iskolai ügyintézés legfontosabb oldalai egy helyen.",
  szulok: "Fontos tudnivalók, dokumentumok és elérhetőségek a szülők számára.",
  "nyilt-nap":
    "2026. november 20. – Ismerd meg képzéseinket és az iskolát. Regisztráció nem szükséges.",
  "csengetesi-rend": "A tanórák és szünetek időpontjai az ESZI-ben.",
  oldalterkep: "A honlap menüpontjai és aloldalai áttekinthetően.",
  felvetelikalkulator:
    "Számítsd ki a hozott pontjaidat az ESZI tanulmányi területeire.",
};
const cards = (items: { title: string; text: string; href: string }[]) => (
  <div className="link-card-grid">
    {items.map((item) => (
      <Link
        className="link-card"
        href={item.href}
        key={item.href}
        {...(item.href.startsWith("http")
          ? { target: "_blank", rel: "noopener noreferrer" }
          : {})}
      >
        <div>
          <h2>{item.title}</h2>
          <p>{item.text}</p>
        </div>
        <Arrow diagonal />
      </Link>
    ))}
  </div>
);
export function CustomContent({ slug }: { slug: string }) {
  const course = slug.startsWith("kepzesek/")
    ? courses.find((c) => `kepzesek/${c.slug}` === slug)
    : undefined;
  if (course)
    return (
      <article className="course-detail">
        <span className="eyebrow">{course.category}</span>
        <div className="info-strip">
          <span>Tanulmányi kód: {course.code}</span>
          <span>Tervezett létszám: {course.places} fő</span>
          <span>2027/2028-as tanév</span>
        </div>
        <p>{course.description}</p>
        <h2>
          {course.jobs.length > 1 ? "Választható szakmák" : "Tanulható szakma"}
        </h2>
        <ul>
          {course.jobs.map((job) => (
            <li key={job}>{job}</li>
          ))}
        </ul>
        {course.jobs.length > 1 && (
          <div className="notice">
            A felsorolt szakmák közül sikeres ágazati alapvizsga után lehet
            választani.
          </div>
        )}
        <h2>Érdekel ez az irány?</h2>
        <p>
          A felvételi feltételeket, az aktuális határidőket és a jelentkezés
          részleteit a felvételi tájékoztatóban találod. A pontszámítóval
          ellenőrizheted a hozott pontjaidat.
        </p>
        <div className="article-actions">
          <Link className="button" href="/jelentkezes">
            Felvételi tájékoztató <Arrow />
          </Link>
          <Link className="button button-outline" href="/felvetelikalkulator">
            Pontszámító
          </Link>
          <Link className="button button-outline" href="/nyilt-nap">
            Nyílt nap
          </Link>
        </div>
        <p className="source-note">
          A képzésadatok a 2027/2028-as tanévre közzétett ESZI-tájékoztató
          alapján szerepelnek.
        </p>
      </article>
    );
  if (slug === "kepzesek")
    return (
      <>
        <p className="page-intro">
          Fedezd fel tanulmányi területeinket, majd nézd meg a részletes
          felvételi tudnivalókat. A kártyákon az egyes irányokhoz tartozó
          szakmákat is megismerheted.
        </p>
        <CourseGrid />
        <div className="article-actions">
          <Link className="button" href="/jelentkezes">
            Jelentkezési tudnivalók <Arrow />
          </Link>
          <Link className="button button-outline" href="/felnottkepzes">
            Felnőttképzés
          </Link>
        </div>
      </>
    );
  if (slug === "diakelet")
    return cards([
      {
        title: "Kollégium",
        text: "Tanulás, pihenés, közösség: ismerd meg a kollégiumi életet.",
        href: "/kollegium",
      },
      {
        title: "Sport és szakkörök",
        text: "Fedezd fel a tanórákon túli lehetőségeket.",
        href: "/szakkorok",
      },
      {
        title: "Galéria",
        text: "Emlékezetes pillanatok és iskolai események képekben.",
        href: "/galeria",
      },
      {
        title: "Diákönkormányzat",
        text: "Közösségi ügyek és a diákok képviselete.",
        href: "/dok",
      },
      {
        title: "Iskolarádió",
        text: "Az iskolai rádió műsorai és információi.",
        href: "/iskolaradio",
      },
      {
        title: "Eszirat",
        text: "Iskolai újság és olvasnivalók.",
        href: "/eszirat",
      },
      {
        title: "Könyvtár",
        text: "Könyvek és források a tanuláshoz.",
        href: "/konyvtar",
      },
      {
        title: "Közösségi szolgálat",
        text: "Tudnivalók és dokumentumok az iskolai közösségi szolgálathoz.",
        href: "/kozossegiszolgalat",
      },
    ]);
  if (slug === "diakok")
    return cards([
      {
        title: "KRÉTA",
        text: "Belépés a digitális osztálynaplóba.",
        href: "/kreta",
      },
      {
        title: "Órarend",
        text: "Az aktuális órarend az EduPage felületén.",
        href: timetable,
      },
      {
        title: "Ebédrendelés",
        text: "Étlapok, határidők és belépés az étkezési rendszerbe.",
        href: "/ebedrendeles",
      },
      {
        title: "Csengetési rend",
        text: "Tanórák és szünetek időpontjai.",
        href: "/csengetesi-rend",
      },
      {
        title: "Eseménynaptár",
        text: "Az iskola eseményei a hivatalos naptárban.",
        href: calendar,
      },
      {
        title: "Vizsgák",
        text: "Alapvizsga, érettségi, szakmai vizsga és további tudnivalók.",
        href: "/alapvizsga",
      },
      {
        title: "Dokumentumtár",
        text: "Szabályzatok, tájékoztatók és letölthető dokumentumok.",
        href: "/alapdokumentumok",
      },
      {
        title: "Diákélet",
        text: "Sport, galéria és közösségi programok.",
        href: "/diakelet",
      },
    ]);
  if (slug === "szulok")
    return cards([
      {
        title: "Tájékoztatók",
        text: "Fontos információk és mindennapi ügyintézés.",
        href: "/tajekoztatok",
      },
      {
        title: "KRÉTA",
        text: "A digitális osztálynapló elérése.",
        href: "/kreta",
      },
      {
        title: "Ebédrendelés",
        text: "Étkezés, támogatások és nyomtatványok.",
        href: "/ebedrendeles",
      },
      {
        title: "Szabályzatok",
        text: "Az intézményi működés legfontosabb dokumentumai.",
        href: "/szabalyzatok",
      },
      {
        title: "Kapcsolat",
        text: "Munkatársak és ügyintézési elérhetőségek.",
        href: "/kapcsolat",
      },
      {
        title: "Képzési tanács",
        text: "A képzési tanács információi.",
        href: "/kepzesitanacs",
      },
      {
        title: "Egészségvédelem",
        text: "Iskola-egészségügyi tudnivalók.",
        href: "/egeszsegvedelem",
      },
      {
        title: "Ifjúságvédelem",
        text: "Segítség és támogatás a diákoknak.",
        href: "/ifjusagvedelem",
      },
      {
        title: "Munkaterv",
        text: "Az iskola aktuális munkaterve.",
        href: workplan,
      },
    ]);
  if (slug === "csengetesi-rend")
    return (
      <>
        <ol className="bell-list">
          {[
            "07:50 – 08:35",
            "08:45 – 09:30",
            "09:40 – 10:25",
            "10:35 – 11:20",
            "11:40 – 12:25",
            "12:45 – 13:30",
            "13:40 – 14:25",
            "14:30 – 15:15",
            "15:20 – 16:05",
          ].map((time, i) => (
            <li key={time}>
              <strong>{i + 1}. tanóra</strong>
              <span>{time}</span>
            </li>
          ))}
        </ol>
        <div className="article-actions">
          <a
            className="button"
            href={timetable}
            target="_blank"
            rel="noopener noreferrer"
          >
            Órarend megnyitása <Arrow diagonal />
          </a>
        </div>
      </>
    );
  if (slug === "nyilt-nap")
    return (
      <>
        <div className="notice">
          <strong>Regisztráció nem szükséges!</strong> Várunk 2026. november
          20-án, az ESZI-ben, Pakson.
        </div>
        <div className="prose">
          <h2>A nap programja</h2>
          <div
            className="table-scroll"
            role="region"
            aria-label="A nyílt nap programja"
            tabIndex={0}
          >
            <table>
              <thead>
                <tr>
                  <th>Időpont</th>
                  <th>Program</th>
                  <th>Helyszín</th>
                </tr>
              </thead>
              <tbody>
                {[
                  [
                    "14:30–17:00",
                    "Tanulmányi területek bemutatói",
                    "ESZI sportcsarnok",
                  ],
                  ["15:00", "Igazgatói köszöntő", "ESZI sportcsarnok"],
                  [
                    "15:45 és 16:15",
                    "Tanulmányi területek tájékoztató előadásai",
                    "Technikumi épület",
                  ],
                  ["15:30–17:00", "Nyitott tantermek", "Technikumi épület"],
                  [
                    "16:00–18:00",
                    "A kollégium bemutatása",
                    "Paks, Gagarin u. 3.",
                  ],
                ].map((row) => (
                  <tr key={row[0]}>
                    {row.map((cell, i) => (
                      <td key={i}>{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <h2>Hét tanulmányi terület, hét új lehetőség</h2>
          <p>
            Gépészet, informatika, elektronika, pénzügy, környezetvédelem, ipari
            informatika és mechatronika. Ismerd meg a képzéseket és a tanulás
            helyszíneit!
          </p>
        </div>
        <div className="article-actions">
          <Link href="/jelentkezes" className="button">
            Teljes program és tájékoztató <Arrow />
          </Link>
          <Link href="/kapcsolat" className="button button-outline">
            Hogyan jutok el?
          </Link>
        </div>
      </>
    );
  if (slug === "felvetelikalkulator") return <Calculator />;
  if (slug === "oldalterkep")
    return (
      <>
        <div className="sitemap-groups">
          {groups.map((g) => (
            <section className="content-card" key={g.href}>
              <h2>{g.label}</h2>
              {g.links.map((l) => (
                <Link href={l.href} key={l.href}>
                  {l.label}
                </Link>
              ))}
            </section>
          ))}
          <section className="content-card">
            <h2>Gyors elérés</h2>
            {quickLinks.map((l) => (
              <a href={l.href} key={l.href}>
                {l.label}
              </a>
            ))}
            <Link href="/hirek">Hírek</Link>
            <Link href="/hirarchivum">Hírarchívum</Link>
            <Link href="/kereses">Keresés</Link>
          </section>
          <section className="content-card">
            <h2>Képzéseink</h2>
            {courses.map((c) => (
              <Link href={`/kepzesek/${c.slug}`} key={c.code}>
                {c.name}
              </Link>
            ))}
          </section>
        </div>
        <details className="content-accordion" style={{ marginTop: 24 }}>
          <summary>További és archív oldalak</summary>
          <div className="h4box sitemap-groups">
            {Object.values(pages)
              .filter((p) => !p.slug.startsWith("galeria/esemeny/"))
              .sort((a, b) => a.title.localeCompare(b.title, "hu"))
              .map((p) => (
                <Link key={p.slug} href={`/${p.slug}`}>
                  {p.title}
                </Link>
              ))}
          </div>
        </details>
      </>
    );
  return null;
}
