export type SearchDocument = { slug: string; title: string; text: string };
export const normalize = (s: string) =>
  s
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("hu");
export function decode(s: string) {
  return s
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&gt;/g, ">")
    .replace(/&lt;/g, "<")
    .replace(/&#\d+;/g, " ")
    .replace(/\s+/g, " ");
}
export function prepareDocuments(documents: SearchDocument[]) {
  return documents.map((p) => ({
    ...p,
    normalizedTitle: normalize(p.title),
    normalizedText: normalize(p.title + " " + decode(p.text)),
  }));
}
export function searchDocuments(
  documents: ReturnType<typeof prepareDocuments>,
  query: string,
) {
  const words = [
    ...new Set(normalize(query.slice(0, 200)).split(/\s+/).filter(Boolean)),
  ];
  if (!words.length) return [];
  return documents
    .filter((p) => words.every((word) => p.normalizedText.includes(word)))
    .map((p) => ({
      ...p,
      rank: words.reduce(
        (sum, word) => sum + (p.normalizedTitle.includes(word) ? 10 : 0),
        0,
      ),
    }))
    .sort((a, b) => b.rank - a.rank || a.title.localeCompare(b.title, "hu"));
}
