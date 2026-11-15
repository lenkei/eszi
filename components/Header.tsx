"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { groups, quickLinks } from "@/lib/navigation";
import { Icon } from "./Icons";
export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [panel, setPanel] = useState<string | null>(null);
  const root = useRef<HTMLElement>(null);
  const toggle = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    setOpen(false);
    setPanel(null);
  }, [pathname]);
  useEffect(() => {
    function key(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setOpen(false);
        setPanel(null);
        toggle.current?.focus();
      }
    }
    function outside(e: PointerEvent) {
      if (root.current && !root.current.contains(e.target as Node)) {
        setPanel(null);
      }
    }
    document.addEventListener("keydown", key);
    document.addEventListener("pointerdown", outside);
    return () => {
      document.removeEventListener("keydown", key);
      document.removeEventListener("pointerdown", outside);
    };
  }, []);
  const desktop = [groups[0], groups[1], groups[2]];
  return (
    <header className="site-header" ref={root}>
      <div className="utility-bar">
        <div className="container utility-inner">
          <span>
            Paks <span aria-hidden="true">/</span> Energetikai Technikum és
            Kollégium
          </span>
          <nav aria-label="Gyors ügyintézés">
            {quickLinks.map((l) => (
              <a
                key={l.href}
                href={l.href}
                {...(l.href.startsWith("http")
                  ? { target: "_blank", rel: "noopener noreferrer" }
                  : {})}
              >
                {l.label}
              </a>
            ))}
            <Link href="/kapcsolat">Kapcsolat</Link>
          </nav>
        </div>
      </div>
      <div className="container header-main">
        <Link href="/" className="brand" aria-label="ESZI – Főoldal">
          <span className="brand-mark">eszi</span>
          <span className="brand-name">
            Energetikai Technikum
            <br />
            és Kollégium
          </span>
        </Link>
        <nav className="desktop-nav" aria-label="Főmenü">
          {desktop.map((g) => (
            <div className="nav-item" key={g.href}>
              <Link
                href={g.href}
                className={
                  g.links.some((l) => l.href === pathname) ? "active" : ""
                }
              >
                {g.label}
              </Link>
              <button
                className="dropdown-toggle"
                aria-label={`${g.label} almenü`}
                aria-expanded={panel === g.label}
                aria-controls="desktop-submenu"
                onClick={() => setPanel(panel === g.label ? null : g.label)}
              >
                <Icon name="chevron" />
              </button>
            </div>
          ))}
          <button
            className={`nav-more ${["Vizsgák", "Dokumentumtár", "Szülő-diák", "Fenntartó"].includes(panel || "") ? "active" : ""}`}
            onClick={() =>
              setPanel(panel === "Tudnivalók" ? null : "Tudnivalók")
            }
            aria-expanded={panel === "Tudnivalók"}
            aria-controls="desktop-submenu"
          >
            Tudnivalók <Icon name="chevron" />
          </button>
          <Link href="/hirek" className={pathname === "/hirek" ? "active" : ""}>
            Hírek
          </Link>
        </nav>
        <div className="header-actions">
          <Link
            href="/kereses"
            className="icon-button"
            aria-label="Keresés a honlapon"
          >
            <Icon name="search" />
          </Link>
          <Link
            className="button button-small header-apply"
            href="/jelentkezes"
          >
            Felvételi 2027
          </Link>
          <button
            ref={toggle}
            className="mobile-toggle"
            onClick={() => setOpen(!open)}
            aria-expanded={open}
            aria-controls="mobile-menu"
          >
            <span>{open ? "Bezárás" : "Menü"}</span>
            <Icon name={open ? "close" : "menu"} />
          </button>
        </div>
      </div>
      {panel && (
        <div id="desktop-submenu" className="desktop-submenu">
          <div className="container mega-grid">
            {(panel === "Tudnivalók"
              ? groups.slice(3)
              : groups.filter((g) => g.label === panel)
            ).map((g) => (
              <div key={g.href}>
                <Link className="mega-title" href={g.href}>
                  {g.label} <span aria-hidden="true">↗</span>
                </Link>
                {g.links.map((l) => (
                  <Link
                    href={l.href}
                    key={l.href}
                    onClick={() => setPanel(null)}
                  >
                    {l.label}
                  </Link>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}
      <nav
        id="mobile-menu"
        className="mobile-menu"
        aria-label="Mobil főmenü"
        hidden={!open}
      >
        <div className="mobile-quick">
          {quickLinks.map((l) => (
            <a
              key={l.href}
              href={l.href}
              {...(l.href.startsWith("http")
                ? { target: "_blank", rel: "noopener noreferrer" }
                : {})}
            >
              {l.label}
            </a>
          ))}
        </div>
        {groups.map((g) => (
          <details key={g.href} name="mobile-nav">
            <summary>
              {g.label}
              <Icon name="chevron" />
            </summary>
            <div>
              {g.links.map((l) => (
                <Link
                  href={l.href}
                  key={l.href}
                  aria-current={pathname === l.href ? "page" : undefined}
                  onClick={() => setOpen(false)}
                >
                  {l.label}
                </Link>
              ))}
            </div>
          </details>
        ))}
        <div className="mobile-bottom">
          <Link href="/hirek" onClick={() => setOpen(false)}>
            Hírek
          </Link>
          <Link href="/kapcsolat" onClick={() => setOpen(false)}>
            Kapcsolat
          </Link>
          <Link
            href="/jelentkezes"
            className="button"
            onClick={() => setOpen(false)}
          >
            Felvételi tájékoztató
          </Link>
        </div>
      </nav>
    </header>
  );
}
