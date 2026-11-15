"use client";
import { Fragment, useState } from "react";
import {
  subjects,
  areas,
  calculateArea,
  type Grades,
  type Subject,
} from "@/lib/admissions";
export function Calculator() {
  const [grades, setGrades] = useState<Grades>({});
  function change(subject: Subject, year: 0 | 1, value: string) {
    setGrades((old) => {
      const pair: [number | null, number | null] = [
        ...(old[subject] || [null, null]),
      ];
      pair[year] = value ? Number(value) : null;
      return { ...old, [subject]: pair };
    });
  }
  return (
    <>
      <div className="notice calculator-intro">
        Add meg a 7. év végi és a 8. félévi osztályzataidat. A kalkulátor az
        eredeti ESZI-pontszámítás alapján számolja a hozott pontokat. Az
        eredmény kizárólag az ESZI-be jelentkezéshez irányadó, a felvételi
        tájékoztatót nem helyettesíti.
      </div>
      <div className="grade-grid">
        <div className="grade-head">Tantárgy</div>
        <div className="grade-head">7. év vége</div>
        <div className="grade-head">8. félév</div>
        {subjects.map((subject) => (
          <Fragment key={subject}>
            <div className="subject-name">{subject}</div>
            {([0, 1] as const).map((year) => (
              <div key={year}>
                <label
                  className="sr-only"
                  htmlFor={`grade-${subjects.indexOf(subject)}-${year}`}
                >
                  {subject}, {year === 0 ? "7. év vége" : "8. félév"}
                </label>
                <select
                  id={`grade-${subjects.indexOf(subject)}-${year}`}
                  value={grades[subject]?.[year] ?? ""}
                  onChange={(e) => change(subject, year, e.target.value)}
                >
                  <option value="">–</option>
                  {[2, 3, 4, 5].map((g) => (
                    <option key={g} value={g}>
                      {g}
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </Fragment>
        ))}
      </div>
      <div className="article-actions">
        <button className="button button-outline" onClick={() => setGrades({})}>
          Adatok törlése
        </button>
      </div>
      <h2 style={{ fontSize: "1.5rem", marginTop: 28 }}>
        Hozott pontjaid képzésenként
      </h2>
      <div
        className="calculator-results"
        aria-live="polite"
        aria-atomic="false"
      >
        {areas.map((area) => {
          const result = calculateArea(area.rules, grades);
          return (
            <section className="result-card" key={area.code}>
              <span className="eyebrow">{area.code}</span>
              <h3>{area.name}</h3>
              {result.ready ? (
                <>
                  <output className="result-score">
                    {result.total?.toLocaleString("hu-HU")} / 80 pont
                  </output>
                  <ul>
                    {result.breakdown.map((d) => (
                      <li key={d.label}>
                        {d.label}: {d.points.toLocaleString("hu-HU")} pont
                      </li>
                    ))}
                  </ul>
                </>
              ) : (
                <>
                  <p>A számításhoz még szükséges:</p>
                  <ul>
                    {result.missing.map((s) => (
                      <li key={s}>{s}</li>
                    ))}
                  </ul>
                </>
              )}
            </section>
          );
        })}
      </div>
    </>
  );
}
