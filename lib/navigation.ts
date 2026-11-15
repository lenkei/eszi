export type NavLink = { label: string; href: string };
export type NavGroup = { label: string; href: string; links: NavLink[] };
export const groups: NavGroup[] = [
  {
    label: "Iskolánkról",
    href: "/bemutatkozo",
    links: [
      ["Bemutatkozás", "bemutatkozo"],
      ["Kapcsolat", "kapcsolat"],
      ["Oktatók", "oktatok"],
      ["Osztályok", "osztalyok"],
      ["Kollégium", "kollegium"],
      ["Könyvtár", "konyvtar"],
      ["Alapítványok", "eszi-szakkepzeseert-alapitvany"],
    ].map(([label, slug]) => ({ label, href: `/${slug}` })),
  },
  {
    label: "Képzések",
    href: "/kepzesek",
    links: [
      ["Képzéseink", "kepzesek"],
      ["Felvételi a 9. évfolyamra", "jelentkezes"],
      ["Nyílt nap", "nyilt-nap"],
      ["Felvételi pontszámító", "felvetelikalkulator"],
      ["Felnőttképzés", "felnottkepzes"],
    ].map(([label, slug]) => ({ label, href: `/${slug}` })),
  },
  {
    label: "Diákélet",
    href: "/diakelet",
    links: [
      ["Élet az ESZI-ben", "diakelet"],
      ["Galéria", "galeria"],
      ["Kollégium", "kollegium"],
      ["Sport és szakkörök", "szakkorok"],
      ["Diákönkormányzat", "dok"],
      ["Közösségi szolgálat", "kozossegiszolgalat"],
      ["Iskolarádió", "iskolaradio"],
      ["Eszirat", "eszirat"],
    ].map(([label, slug]) => ({ label, href: `/${slug}` })),
  },
  {
    label: "Vizsgák",
    href: "/alapvizsga",
    links: [
      ["Alapvizsga", "alapvizsga"],
      ["Érettségi vizsga", "erettsegivizsga"],
      ["Portfólió", "portfolio"],
      ["Szakmai vizsga", "szakmaivizsga"],
      ["Nyelvvizsga", "nyelvvizsga"],
      ["Osztályozó és javítóvizsga", "osztalyozo-javitovizsga"],
    ].map(([label, slug]) => ({ label, href: `/${slug}` })),
  },
  {
    label: "Dokumentumtár",
    href: "/alapdokumentumok",
    links: [
      ["Alapdokumentumok", "alapdokumentumok"],
      ["Szabályzatok", "szabalyzatok"],
      ["Vizsgaeredmények", "vizsgaeredmenyek"],
      ["Versenyeredmények", "versenyeredmenyek"],
      ["Közzététel, adatvédelem", "kozzetetelilista"],
      ["További adatok", "dokumentumtar-tovabbi"],
    ].map(([label, slug]) => ({ label, href: `/${slug}` })),
  },
  {
    label: "Szülő-diák",
    href: "/tajekoztatok",
    links: [
      ["Tájékoztatók", "tajekoztatok"],
      ["Képzési tanács", "kepzesitanacs"],
      ["Egészségvédelem", "egeszsegvedelem"],
      ["Ifjúságvédelem", "ifjusagvedelem"],
      ["Ebédrendelés", "ebedrendeles"],
      ["KRÉTA", "kreta"],
      ["Csengetési rend", "csengetesi-rend"],
    ].map(([label, slug]) => ({ label, href: `/${slug}` })),
  },
  {
    label: "Fenntartó",
    href: "/fenntarto",
    links: [
      ["Szervezet", "fenntarto"],
      ["Ösztöndíj", "fenntarto-osztondij"],
      ["ESZI-gyűrű", "eszi-gyuru"],
      ["ESZI Kiválósága", "fenntarto-eszikivalosaga"],
      ["Szolgáltatások", "fenntarto-szolgaltatasok"],
      ["Közérdekű adatok", "fenntarto-kozerdekuadatok"],
      ["Ellenőrzések", "fenntarto-ellenorzesek"],
      ["Archívum", "fenntarto-archivum"],
    ].map(([label, slug]) => ({ label, href: `/${slug}` })),
  },
];
export const timetable =
  "https://eszi.edupage.org/timetable/view.php?fullscreen=1";
export const calendar =
  "https://outlook.office365.com/owa/calendar/00fd0e80fd704dd68db8cffd1fc18b3a@eszi.hu/4842f405ed4e4906b0018a30400d0f354704214731897045625/calendar.html";
export const workplan =
  "https://energetikaiszg-my.sharepoint.com/:w:/r/personal/csanadiz_eszi_hu/Documents/Ig/Munkatervek/ESZI%20munkaterve%202026-2027.docx?d=wb56f9484f5844f058c9c123b6257837b&csf=1&web=1&e=FxC6BQ";
export const quickLinks: NavLink[] = [
  { label: "KRÉTA", href: "/kreta" },
  { label: "Órarend", href: timetable },
  { label: "Ebédrendelés", href: "/ebedrendeles" },
  { label: "Eseménynaptár", href: calendar },
];
