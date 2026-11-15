import type { Metadata } from "next";
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
const normalize = (s: string) =>
  s
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("hu");
function decode(s: string) {
  return s
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&gt;/g, ">")
    .replace(/&lt;/g, "<")
    .replace(/&#\d+;/g, " ")
    .replace(/\s+/g, " ");
}
export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string | string[] }>;
}) {
  const params = await searchParams;
  const q = (typeof params.q === "string" ? params.q : "").slice(0, 200).trim();
  const documents = [
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
  ];
  const words = normalize(q).split(/\s+/).filter(Boolean);
  const results = q
    ? documents
        .map((p) => ({
          ...p,
          rank: words.reduce(
            (n, w) => n + (normalize(p.title).includes(w) ? 10 : 0),
            0,
          ),
        }))
        .filter((p) =>
          words.every((w) =>
            normalize(p.title + " " + decode(p.text)).includes(w),
          ),
        )
        .sort((a, b) => b.rank - a.rank || a.title.localeCompare(b.title, "hu"))
        .slice(0, 60)
    : [];
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
              ? `${results.length}${results.length === 60 ? "+" : ""} találat erre: „${q}”`
              : `Nincs találat erre: „${q}”. Próbálj rövidebb vagy másik kifejezést.`}
          </p>
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
