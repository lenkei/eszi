import test from "node:test";
import assert from "node:assert/strict";
import { prepareDocuments, searchDocuments } from "../lib/search.ts";
const docs = prepareDocuments([
  { slug: "a", title: "Felvételi tájékoztató", text: "Iskolánk" },
  { slug: "b", title: "Iskolai hírek", text: "Felvételi &amp; tudnivalók" },
]);
test("search normalizes accents and ranks title matches first", () => {
  assert.deepEqual(
    searchDocuments(docs, "FELVETELI").map((p) => p.slug),
    ["a", "b"],
  );
  assert.deepEqual(
    searchDocuments(docs, "felveteli tudnivalok").map((p) => p.slug),
    ["b"],
  );
});
test("empty, combining-only and markup queries do not return all pages", () => {
  for (const q of ["", "  ", "\u0301", "<img src=x onerror=alert(1)>"])
    assert.deepEqual(searchDocuments(docs, q), []);
});
test("repeated words do not inflate rankings and search input is bounded", () => {
  assert.equal(searchDocuments(docs, "felveteli felveteli")[0].rank, 10);
  assert.deepEqual(searchDocuments(docs, " ".repeat(200) + "felveteli"), []);
});
