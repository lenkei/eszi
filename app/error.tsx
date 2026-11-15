"use client";
export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <main id="main" className="container error-page">
      <span className="eyebrow">HIBA TÖRTÉNT</span>
      <h1>Egy pillanatnyi fennakadás.</h1>
      <p>Az oldal most nem tölthető be. Próbáld újra.</p>
      <button className="button" onClick={reset}>
        Újrapróbálom
      </button>
    </main>
  );
}
