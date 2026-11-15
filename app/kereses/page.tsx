import type { Metadata } from "next";
import { decode, prepareDocuments, searchDocuments } from "@/lib/search";
import Link from "next/link";
import index from "@/content/search-index.json";
import { courses } from "@/lib/courses";
import { customTitles, customDescriptions } from "@/components/CustomPages";
import { PageShell } from "@/components/PageShell";
import { groups } from "@/lib/navigation";
export const metadata: Metadata = {
  title: "Keresés a honlapon",
  robots: { index: false, follow: true },
};
const documents = prepareDocuments([
  ...index,
  ...Object.entries(customTitles)
    .filter(([slug]) => !index.some((p) => p.slug === slug))
    .map(([slug, title]) => ({
      slug,
      title,
      text: customDescriptions[slug] || "",
    })),
  ...courses.map((c) => ({
    slug: `kepzesek/${c.slug}`,
    title: c.name,
    text: c.description + " " + c.jobs.join(" "),
  })),
]);

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string | string[] }>;
}) {
  const params = await searchParams;
  const q = (typeof params.q === "string" ? params.q : "").slice(0, 200).trim();
  const matches = searchDocuments(documents, q);
  const results = matches.slice(0, 60);
  return (
    <PageShell
      title="Mit keresel?"
      description="Keress képzések, dokumentumok és tudnivalók között. Ékezet nélkül is kereshetsz."
      slug="kereses"
      links={groups.map((g) => ({ label: g.label, href: g.href }))}
    >
      <form className="search-form" role="search" action="/kereses">
        <label className="sr-only" htmlFor="search">
          Keresőkifejezés
        </label>
        <input
          id="search"
          name="q"
          type="search"
          placeholder="Például: felvételi, ösztöndíj, ebéd…"
          defaultValue={q}
          maxLength={200}
          minLength={2}
          required
        />
        <button className="button" type="submit">
          Keresés
        </button>
      </form>
      {q ? (
        <>
          <p className="search-count" role="status">
            {results.length
              ? `${matches.length} találat erre: „${q}”`
              : `Nincs találat erre: „${q}”. Próbálj rövidebb vagy másik kifejezést.`}
          </p>
          {matches.length > 60 && (
            <p>
              Az első 60 találat látható. Pontosítsd a keresést további
              kifejezésekkel.
            </p>
          )}
          <div className="search-results">
            {results.map((p) => (
              <Link className="link-card" href={`/${p.slug}`} key={p.slug}>
                <div>
                  <h2>{p.title}</h2>
                  <p>{decode(p.text).slice(0, 190)}…</p>
                </div>
                <span aria-hidden="true">↗</span>
              </Link>
            ))}
          </div>
        </>
      ) : (
        <div className="notice">
          Írd be a keresett témát, például „felvételi” vagy „kollégium”.
        </div>
      )}
    </PageShell>
  );
}
