import Link from "next/link";
import { courses } from "@/lib/courses";
import { Arrow } from "./Icons";
export function CourseGrid() {
  return (
    <div className="course-grid">
      {courses.map((c) => (
        <Link className="course-card" href={`/kepzesek/${c.slug}`} key={c.code}>
          <div className="course-card-top">
            <span>{c.icon}</span>
            <Arrow diagonal />
          </div>
          <h3>{c.name}</h3>
          <p>{c.tagline}</p>
          <span className="course-code">Tanulmányi kód: {c.code}</span>
        </Link>
      ))}
      <Link href="/felvetelikalkulator" className="course-card course-help">
        <span className="eyebrow">TALÁLD MEG AZ IRÁNYOD</span>
        <h3>Melyik illik hozzád?</h3>
        <p>Fedezd fel a lehetőségeidet.</p>
        <span className="text-link">
          Pontszámító <Arrow />
        </span>
      </Link>
    </div>
  );
}
