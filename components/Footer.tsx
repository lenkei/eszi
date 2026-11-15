import Link from "next/link";
import { groups, calendar, timetable, workplan } from "@/lib/navigation";
export function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-top">
          <div>
            <Link href="/" className="brand">
              <span className="brand-mark">eszi</span>
              <span className="brand-name">
                Energetikai Technikum
                <br />
                és Kollégium
              </span>
            </Link>
            <p>Tudás. Közösség. Lehetőség.</p>
            <address>
              7030 Paks, Dózsa György út 95.
              <br />
              <a href="tel:+3675519300">+36 75 519 300</a>
              <br />
              <a href="mailto:eszi@eszi.hu">eszi@eszi.hu</a>
            </address>
            <div className="social-links">
              <a
                href="https://www.facebook.com/eszi.hu/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Facebook ↗
              </a>
              <a
                href="https://www.instagram.com/eszigram/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Instagram ↗
              </a>
              <a
                href="https://www.youtube.com/c/eszipaks1"
                target="_blank"
                rel="noopener noreferrer"
              >
                YouTube ↗
              </a>
              <a
                href="https://www.tiktok.com/@eszipaks"
                target="_blank"
                rel="noopener noreferrer"
              >
                TikTok ↗
              </a>
            </div>
          </div>
          <div>
            <h2>Hasznos linkek</h2>
            <Link href="/jelentkezes">Jelentkezőknek</Link>
            <Link href="/kreta">KRÉTA</Link>
            <a href={timetable} target="_blank" rel="noopener noreferrer">
              Órarend ↗
            </a>
            <Link href="/ebedrendeles">Ebédrendelés</Link>
            <a href={calendar} target="_blank" rel="noopener noreferrer">
              Eseménynaptár ↗
            </a>
            <a href={workplan} target="_blank" rel="noopener noreferrer">
              Munkaterv ↗
            </a>
          </div>
          <div>
            <h2>Tudnivalók</h2>
            {groups.slice(3).map((g) => (
              <Link key={g.href} href={g.href}>
                {g.label}
              </Link>
            ))}
            <Link href="/kozzetetelilista">Közzététel, adatvédelem</Link>
            <Link href="/oldalterkep">Oldaltérkép</Link>
          </div>
          <div className="footer-contact">
            <span className="eyebrow">SEGÍTHETÜNK?</span>
            <h2>
              Beszéljünk a<br />
              lehetőségeidről.
            </h2>
            <Link className="button button-lime" href="/kapcsolat">
              Kapcsolatfelvétel <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
        <div className="footer-bottom">
          <span>
            © {new Date().getFullYear()} Energetikai Technikum és Kollégium
          </span>
          <span>Paks, ahol a jövő energiát kap.</span>
        </div>
      </div>
    </footer>
  );
}
