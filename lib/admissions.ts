export const subjects = [
  "Magyar nyelv",
  "Irodalom",
  "Matematika",
  "Idegen nyelv",
  "Történelem",
  "Fizika",
  "Biológia",
  "Kémia",
] as const;
export type Subject = (typeof subjects)[number];
export type Grades = Partial<Record<Subject, [number | null, number | null]>>;
export type Rule = { label: string; subjects: Subject[]; multiplier: number };
const technical: Rule[] = [
  {
    label: "Magyar nyelv és irodalom",
    subjects: ["Magyar nyelv", "Irodalom"],
    multiplier: 1,
  },
  { label: "Matematika", subjects: ["Matematika"], multiplier: 2 },
  { label: "Idegen nyelv", subjects: ["Idegen nyelv"], multiplier: 1 },
  { label: "Történelem", subjects: ["Történelem"], multiplier: 1 },
  { label: "Fizika", subjects: ["Fizika"], multiplier: 2 },
];
export const areas: { code: string; name: string; rules: Rule[] }[] = [
  { code: "0001", name: "Gépészet", rules: technical },
  {
    code: "0002",
    name: "Informatika",
    rules: technical.map((r) =>
      r.label === "Idegen nyelv"
        ? { ...r, multiplier: 2 }
        : r.label === "Fizika"
          ? { ...r, multiplier: 1 }
          : r,
    ),
  },
  { code: "0003", name: "Elektronika", rules: technical },
  {
    code: "0004",
    name: "Pénzügy",
    rules: [
      { label: "Magyar nyelv", subjects: ["Magyar nyelv"], multiplier: 2 },
      { label: "Irodalom", subjects: ["Irodalom"], multiplier: 1 },
      { label: "Matematika", subjects: ["Matematika"], multiplier: 3 },
      { label: "Idegen nyelv", subjects: ["Idegen nyelv"], multiplier: 1 },
      { label: "Történelem", subjects: ["Történelem"], multiplier: 1 },
    ],
  },
  {
    code: "0005",
    name: "Környezetvédelem",
    rules: [
      {
        label: "Magyar nyelv és irodalom átlaga",
        subjects: ["Magyar nyelv", "Irodalom"],
        multiplier: 0.5,
      },
      { label: "Matematika", subjects: ["Matematika"], multiplier: 2 },
      { label: "Idegen nyelv", subjects: ["Idegen nyelv"], multiplier: 1 },
      { label: "Biológia", subjects: ["Biológia"], multiplier: 2 },
      { label: "Kémia", subjects: ["Kémia"], multiplier: 2 },
    ],
  },
  { code: "0006", name: "Ipari informatika", rules: technical },
  { code: "0007", name: "Mechatronika", rules: technical },
];
export function calculateArea(rules: Rule[], grades: Grades) {
  const missing: Subject[] = [];
  let total = 0;
  const breakdown: { label: string; points: number }[] = [];
  for (const rule of rules) {
    let sum = 0;
    let valid = true;
    for (const subject of rule.subjects) {
      const pair = grades[subject];
      if (
        !Array.isArray(pair) ||
        pair.length !== 2 ||
        [pair[0], pair[1]].some(
          (g) =>
            typeof g !== "number" || !Number.isInteger(g) || g < 2 || g > 5,
        )
      ) {
        missing.push(subject);
        valid = false;
      } else sum += (pair[0] as number) + (pair[1] as number);
    }
    if (valid) {
      const points = sum * rule.multiplier;
      total += points;
      breakdown.push({ label: rule.label, points });
    }
  }
  return {
    ready: missing.length === 0,
    total: missing.length ? null : total,
    missing: [...new Set(missing)],
    breakdown,
  };
}
