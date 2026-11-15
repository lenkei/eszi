import Link from "next/link";
import type { NavLink } from "@/lib/navigation";
import { Icon } from "./Icons";
export function PageShell({
  title,
  eyebrow = "ENERGETIKAI TECHNIKUM ÉS KOLLÉGIUM",
  description,
  slug,
  links,
  children,
}: {
  title: string;
  eyebrow?: string;
  description?: string;
  slug: string;
  links: NavLink[];
  children: React.ReactNode;
}) {
  const nav = (
    <nav aria-label="Kapcsolódó oldalak">
      {links.map((l) => (
        <Link
          href={l.href}
          key={l.href}
          aria-current={l.href === `/${slug}` ? "page" : undefined}
        >
          {l.label}
        </Link>
      ))}
    </nav>
  );
  return (
    <main id="main" className="container">
      <nav className="breadcrumbs" aria-label="Morzsamenü">
        <Link href="/">Főoldal</Link>
        <span aria-hidden="true">/</span>
        {slug.startsWith("kepzesek/") && (
          <>
            <Link href="/kepzesek">Képzések</Link>
            <span aria-hidden="true">/</span>
          </>
        )}
        {slug.startsWith("galeria/") && (
          <>
            <Link href="/galeria">Galéria</Link>
            <span aria-hidden="true">/</span>
          </>
        )}
        <span aria-current="page">{title}</span>
      </nav>
      <header className="page-hero">
        <span className="eyebrow">{eyebrow}</span>
        <h1>{title}</h1>
        {description && <p>{description}</p>}
      </header>
      <div className="page-layout">
        <aside className="side-nav">
          <span>Fedezd fel</span>
          {nav}
        </aside>
        <div className="page-content">
          <details className="side-nav-mobile">
            <summary>
              Kapcsolódó oldalak <Icon name="chevron" />
            </summary>
            {nav}
          </details>
          {children}
        </div>
      </div>
    </main>
  );
}
