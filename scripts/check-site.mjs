/** Run after npm run build && npm start. Checks every generated route over HTTP. */
import { readFile } from "node:fs/promises";
const base = process.env.CHECK_BASE_URL || "http://localhost:3000";
const pages = JSON.parse(
  await readFile(new URL("../content/pages.json", import.meta.url), "utf8"),
);
const extras = [
  "/",
  "/kepzesek",
  "/diakelet",
  "/diakok",
  "/szulok",
  "/nyilt-nap",
  "/csengetesi-rend",
  "/oldalterkep",
  "/kereses?q=felveteli",
  "/kepzesek/gepeszet",
  "/kepzesek/informatika",
  "/kepzesek/elektronika",
  "/kepzesek/penzugy",
  "/kepzesek/kornyezetvedelem",
  "/kepzesek/ipari-informatika",
  "/kepzesek/mechatronika",
];
const paths = [
  ...new Set([...Object.keys(pages).map((p) => "/" + p), ...extras]),
];
let next = 0;
const failures = [];
let totalBytes = 0;
async function work() {
  while (next < paths.length) {
    const path = paths[next++];
    try {
      const r = await fetch(base + path);
      const text = await r.text();
      totalBytes += Buffer.byteLength(text);
      if (r.status !== 200) failures.push(`${path}: HTTP ${r.status}`);
      if ((text.match(/<h1(?:\s|>)/g) || []).length !== 1)
        failures.push(`${path}: expected exactly one h1`);
      if (!text.includes('<html lang="hu"'))
        failures.push(`${path}: missing Hungarian language`);
      if (/www\.eszi\.local/.test(text))
        failures.push(`${path}: bad legacy hostname`);
    } catch (e) {
      failures.push(`${path}: ${e.message}`);
    }
  }
}
await Promise.all(Array.from({ length: 8 }, work));
const missing = await fetch(base + "/ez-az-oldal-nem-letezik");
if (missing.status !== 404) failures.push("Unknown route must return 404");
const search = await (await fetch(base + "/kereses?q=felveteli")).text();
if (!search.includes("találat erre"))
  failures.push("Accent-insensitive search returned no result");
for (const path of [
  "/",
  "/jelentkezes",
  "/kereses?q=felveteli",
  "/ez-az-oldal-nem-letezik",
]) {
  const response = await fetch(base + path);
  const csp = response.headers.get("content-security-policy") || "";
  for (const directive of [
    "object-src 'none'",
    "base-uri 'none'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    "script-src-attr 'none'",
  ])
    if (!csp.includes(directive))
      failures.push(`${path}: missing CSP ${directive}`);
  if (csp.includes("unsafe-eval"))
    failures.push(`${path}: unsafe-eval in production`);
  if (response.headers.get("x-content-type-options") !== "nosniff")
    failures.push(`${path}: missing nosniff`);
  if (response.headers.get("x-frame-options") !== "DENY")
    failures.push(`${path}: missing frame protection`);
  if (response.headers.has("x-powered-by"))
    failures.push(`${path}: framework version header exposed`);
  if (!response.headers.get("strict-transport-security"))
    failures.push(`${path}: missing HSTS`);
}
const remoteImage = await fetch(
  base + "/_next/image?url=https%3A%2F%2Fexample.com%2Fimage.jpg&w=640&q=75",
);
if (remoteImage.status !== 400)
  failures.push("Image optimizer must reject arbitrary remote URLs");
const js =
  (await (await fetch(base + "/")).text()).match(/src="([^" ]+\.js[^" ]*)"/g) ||
  [];
console.log(
  JSON.stringify(
    {
      checkedRoutes: paths.length,
      unknownRoute: missing.status,
      averageHtmlBytes: Math.round(totalBytes / paths.length),
      homeScriptTags: js.length,
      failures,
    },
    null,
    2,
  ),
);
if (failures.length) process.exitCode = 1;
