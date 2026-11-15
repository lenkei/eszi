import Link from "next/link";
import Image from "next/image";
import { CourseGrid } from "@/components/CourseGrid";
import { Arrow, Icon } from "@/components/Icons";
export default function Home() {
  return (
    <main id="main">
      <section className="hero container" aria-labelledby="hero-heading">
        <div className="hero-inner">
          <div className="hero-intro">
            <span className="eyebrow">TUDÁS. KÖZÖSSÉG. LEHETŐSÉG.</span>
            <h1 id="hero-heading">
              A jövődnek itt adsz <span>energiát.</span>
            </h1>
            <p>
              Műszaki és gazdasági képzések Pakson.
              <br className="mobile-only" /> Találd meg a saját irányod!
            </p>
          </div>
          <div className="hero-photo">
            <Image
              src="/images/campus.webp"
              alt="Az Energetikai Technikum és Kollégium iskolaépülete Pakson"
              width={1185}
              height={378}
              sizes="(max-width: 760px) 100vw, 1185px"
              preload
            />
            <div className="photo-caption">
              <Icon name="pin" />
              <span>Paks · Energetikai Technikum és Kollégium</span>
            </div>
          </div>
          <div className="hero-bottom">
            <div className="hero-buttons">
              <Link className="button button-lime" href="/kepzesek">
                Felfedezem a képzéseket <Arrow />
              </Link>
              <Link className="hero-about" href="/bemutatkozo">
                Ismerd meg az ESZI-t <Arrow />
              </Link>
            </div>
            <Link className="hero-event" href="/nyilt-nap">
              <span className="event-dot" />
              <span>
                <span className="eyebrow">NYÍLT NAP</span>
                <strong>2026. november 20.</strong>
                <small>
                  Program és részletek <Arrow />
                </small>
              </span>
              <Arrow diagonal />
            </Link>
          </div>
        </div>
      </section>
      <section
        className="container quick-audiences"
        aria-label="Információk látogatóknak"
      >
        {[
          {
            title: "Jelentkezőknek",
            text: "Felvételi, nyílt nap, képzések",
            href: "/jelentkezes",
            icon: "book" as const,
          },
          {
            title: "Diákoknak",
            text: "Órarend, KRÉTA, csengetési rend",
            href: "/diakok",
            icon: "users" as const,
          },
          {
            title: "Szülőknek",
            text: "Tudnivalók és dokumentumok",
            href: "/szulok",
            icon: "spark" as const,
          },
        ].map((l) => (
          <Link href={l.href} key={l.title} className="audience-card">
            <span className="audience-icon">
              <Icon name={l.icon} />
            </span>
            <span>
              <strong>{l.title}</strong>
              <small>{l.text}</small>
            </span>
            <Arrow />
          </Link>
        ))}
      </section>
      <section className="container section" id="kepzesek">
        <div className="section-heading">
          <div>
            <span className="eyebrow">KÉPZÉSEINK / 2027–2028</span>
            <h2>Találd meg a saját irányod.</h2>
          </div>
          <Link href="/jelentkezes" className="text-link">
            Felvételi tájékoztató <Arrow />
          </Link>
        </div>
        <CourseGrid />
      </section>
      <section className="news-section section">
        <div className="container">
          <div className="section-heading">
            <div>
              <span className="eyebrow">AKTUÁLIS</span>
              <h2>Ez történik nálunk.</h2>
            </div>
            <Link href="/hirek" className="text-link">
              Minden hír <Arrow />
            </Link>
          </div>
          <div className="news-grid">
            <Link href="/nyilt-nap" className="news-feature">
              <div className="date-tile">
                <span>NOV</span>
                <strong>20</strong>
              </div>
              <div>
                <span className="eyebrow">NYÍLT NAP</span>
                <h3>Nézd meg, hol kezdődhet a jövőd!</h3>
                <p>Ismerd meg képzéseinket, tantermeinket és az iskolát.</p>
                <span className="text-link">
                  Részletes program <Arrow />
                </span>
              </div>
            </Link>
            <Link href="/hirek#tamogatas" className="news-card">
              <span className="eyebrow">TÁJÉKOZTATÓ</span>
              <h3>Felsőfokú tanulmányok szociális támogatása</h3>
              <p>Pályázati határidő: 2026. november 23.</p>
              <span className="text-link">
                Tovább a felhíváshoz <Arrow />
              </span>
            </Link>
          </div>
        </div>
      </section>
      <section className="container section community">
        <div className="community-copy">
          <span className="eyebrow">TÖBB MINT ISKOLA</span>
          <h2>
            Egy közösség,
            <br />
            ahová jó tartozni.
          </h2>
          <p>Kollégium, sport, közös élmények és inspiráló mindennapok.</p>
          <Link className="button" href="/diakelet">
            Diákélet az ESZI-ben <Arrow />
          </Link>
        </div>
        <div className="community-grid">
          {[
            {
              n: "01",
              title: "Otthon az iskolán túl",
              text: "Ismerd meg kollégiumunkat.",
              href: "/kollegium",
            },
            {
              n: "02",
              title: "Mozgásban a közösség",
              text: "Sportkörök és szakkörök.",
              href: "/szakkorok",
            },
            {
              n: "03",
              title: "Pillanatok, amik összekötnek",
              text: "Nézz körül a galériában.",
              href: "/galeria",
            },
          ].map((l) => (
            <Link href={l.href} key={l.n}>
              <span>{l.n}</span>
              <div>
                <h3>{l.title}</h3>
                <p>{l.text}</p>
              </div>
              <Arrow diagonal />
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
