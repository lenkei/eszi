import type { MetadataRoute } from "next";
import { pages } from "@/lib/content";
import { courses } from "@/lib/courses";
import { customTitles } from "@/components/CustomPages";
export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://www.eszi.hu";
  return [
    { url: base, changeFrequency: "weekly", priority: 1 },
    ...[
      ...new Set([
        ...Object.keys(pages),
        ...Object.keys(customTitles),
        ...courses.map((c) => `kepzesek/${c.slug}`),
      ]),
    ].map((slug) => ({
      url: `${base}/${slug}`,
      changeFrequency: "monthly" as const,
      priority: slug.startsWith("galeria/") ? 0.3 : 0.7,
    })),
  ];
}
