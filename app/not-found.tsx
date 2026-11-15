import Link from "next/link";
export default function NotFound() {
  return (
    <main id="main" className="container error-page">
      <span className="eyebrow">404 / NINCS ILYEN OLDAL</span>
      <h1>Keressünk egy másik irányt.</h1>
      <p>
        Az oldal nem található. A főoldalon vagy a keresőben megtalálhatod, amit
        keresel.
      </p>
      <div className="article-actions">
        <Link className="button" href="/">
          Vissza a főoldalra
        </Link>
        <Link className="button button-outline" href="/kereses">
          Keresés a honlapon
        </Link>
      </div>
    </main>
  );
}
