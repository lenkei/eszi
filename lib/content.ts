import source from "@/content/pages.json";
import { groups } from "./navigation";
export type ContentPage = {
  slug: string;
  title: string;
  html: string;
  description: string;
  source: string;
  navigation: { label: string; href: string }[];
};
export const pages = source as Record<string, ContentPage>;
export function pageNavigation(slug: string) {
  const page = pages[slug];
  if (page?.navigation?.length) return page.navigation;
  if (slug.startsWith("galeria/"))
    return [{ label: "Galéria", href: "/galeria" }];
  const group = groups.find((g) => g.links.some((l) => l.href === `/${slug}`));
  return (
    group?.links || [
      { label: "Képzéseink", href: "/kepzesek" },
      { label: "Jelentkezőknek", href: "/jelentkezes" },
      { label: "Hírek", href: "/hirek" },
      { label: "Kapcsolat", href: "/kapcsolat" },
    ]
  );
}
export const descriptions: Record<string, string> = {
  bemutatkozo:
    "Tudás, közösség és lehetőség 1986 óta. Ismerd meg a paksi Energetikai Technikum és Kollégiumot.",
  jelentkezes:
    "Felvételi információk a 2027/2028-as tanévre. Nyílt nap, képzések, jelentkezési tudnivalók egy helyen.",
  alapvizsga:
    "Ágazati alapvizsgák: ütemezés, követelmények és fontos tudnivalók.",
  alapdokumentumok:
    "Az intézmény alapdokumentumai és a működéséhez kapcsolódó iratok.",
  tajekoztatok:
    "Hasznos információk és mindennapi tudnivalók szülőknek és diákoknak.",
  fenntarto:
    "Az ESZI Intézményfenntartó és Működtető Alapítvány szervezete és tevékenysége.",
  galeria:
    "Közös élmények, iskolai események és emlékezetes pillanatok képekben.",
  kapcsolat:
    "Elérhetőségek és ügyintézés az Energetikai Technikum és Kollégiumban.",
};
