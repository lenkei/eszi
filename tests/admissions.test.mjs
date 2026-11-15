import test from "node:test";
import assert from "node:assert/strict";
import { areas, subjects, calculateArea } from "../lib/admissions.ts";
const filled = (a, b) => Object.fromEntries(subjects.map((s) => [s, [a, b]]));
test("maximum grades yield the documented 80 points in every area", () => {
  for (const a of areas) {
    const r = calculateArea(a.rules, filled(5, 5));
    assert.equal(r.ready, true);
    assert.equal(r.total, 80, a.code);
  }
});
test("minimum allowed grades yield 32 points", () => {
  for (const a of areas)
    assert.equal(calculateArea(a.rules, filled(2, 2)).total, 32);
});
test("incomplete and invalid grades never produce a misleading total", () => {
  for (const a of areas) {
    assert.equal(calculateArea(a.rules, {}).total, null);
    assert.equal(calculateArea(a.rules, filled(9, 5)).ready, false);
    assert.equal(calculateArea(a.rules, filled(1, 5)).ready, false);
  }
});
test("technical and IT weights differ exactly as in the original calculator", () => {
  const g = filled(4, 4);
  g["Idegen nyelv"] = [5, 5];
  g.Fizika = [3, 3];
  assert.equal(calculateArea(areas[0].rules, g).total, 62);
  assert.equal(calculateArea(areas[1].rules, g).total, 66);
});
test("environmental sciences average language and literature and use biology and chemistry", () => {
  const g = filled(4, 4);
  g["Magyar nyelv"] = [4, 5];
  g.Irodalom = [3, 5];
  assert.equal(calculateArea(areas[4].rules, g).total, 64.5);
  delete g.Fizika;
  delete g["Történelem"];
  assert.equal(calculateArea(areas[4].rules, g).ready, true);
});
test("technical clones use identical rules; missing subjects are unique", () => {
  assert.deepEqual(areas[0].rules, areas[2].rules);
  assert.deepEqual(areas[0].rules, areas[5].rules);
  assert.deepEqual(areas[0].rules, areas[6].rules);
  const r = calculateArea(areas[0].rules, {});
  assert.equal(new Set(r.missing).size, r.missing.length);
});
test("malformed grade tuples cannot yield NaN or throw", () => {
  for (const pair of [[], [5], new Array(2), [5, 5, 5], "55", null]) {
    const g = filled(5, 5);
    g.Matematika = pair;
    const r = calculateArea(areas[0].rules, g);
    assert.equal(r.ready, false);
    assert.equal(r.total, null);
  }
});
