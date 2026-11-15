import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { pages, pageNavigation, descriptions } from "@/lib/content";
import { courses } from "@/lib/courses";
import {
  CustomContent,
  customTitles,
  customDescriptions,
} from "@/components/CustomPages";
import { PageShell } from "@/components/PageShell";
type Props = { params: Promise<{ slug: string[] }> };
export const dynamicParams = false;
const allSlugs = [
  ...new Set([
    ...Object.keys(pages),
    ...Object.keys(customTitles),
    ...courses.map((c) => `kepzesek/${c.slug}`),
  ]),
];
export function generateStaticParams() {
  return allSlugs.map((slug) => ({ slug: slug.split("/") }));
}
function getInfo(slug: string) {
  const course = courses.find((c) => slug === `kepzesek/${c.slug}`);
  return {
    title: course?.name || customTitles[slug] || pages[slug]?.title,
    description:
      course?.description ||
      customDescriptions[slug] ||
      descriptions[slug] ||
      undefined,
  };
}
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug: parts } = await params;
  const slug = parts.join("/");
  const info = getInfo(slug);
  return {
    title: info.title || "Az oldal nem található",
    description: info.description || pages[slug]?.description,
    alternates: { canonical: `/${slug}` },
  };
}
export default async function ContentPage({ params }: Props) {
  const { slug: parts } = await params;
  const slug = parts.join("/");
  const info = getInfo(slug);
  if (!info.title) notFound();
  const isCustom = slug in customTitles || slug.startsWith("kepzesek/");
  const page = pages[slug];
  const links = slug.startsWith("kepzesek/")
    ? [
        { label: "Összes képzés", href: "/kepzesek" },
        ...courses.map((c) => ({ label: c.name, href: `/kepzesek/${c.slug}` })),
      ]
    : pageNavigation(slug);
  return (
    <PageShell
      title={info.title}
      description={info.description}
      slug={slug}
      links={links}
      eyebrow={
        slug.startsWith("galeria")
          ? "KÖZÖS ÉLMÉNYEINK"
          : slug.startsWith("kepzesek")
            ? "KÉPZÉSEINK / 2027–2028"
            : undefined
      }
    >
      {isCustom ? (
        <CustomContent slug={slug} />
      ) : (
        <>
          {slug === "jelentkezes" && (
            <div className="article-actions">
              <Link className="button" href="/kepzesek">
                Képzések áttekintése →
              </Link>
              <Link
                className="button button-outline"
                href="/felvetelikalkulator"
              >
                Felvételi pontszámító
              </Link>
            </div>
          )}
          <article
            className="prose"
            dangerouslySetInnerHTML={{ __html: page.html }}
          />
          <p className="source-note">
            Az információk az intézmény közzétett tájékoztatóin alapulnak.
            Kérdés esetén <Link href="/kapcsolat">keresd munkatársainkat</Link>.
          </p>
        </>
      )}
    </PageShell>
  );
}
