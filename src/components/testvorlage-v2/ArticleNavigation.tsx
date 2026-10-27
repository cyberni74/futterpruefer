import type { Abschnitt } from "./schema";
import { nn } from "./Section";

/** Inhaltsverzeichnis: Desktop als sticky Sidebar, mobil einklappbar (natives details, ohne JavaScript). */
export function ArticleNavigation({ abschnitte, variante }: { abschnitte: Abschnitt[]; variante: "sidebar" | "mobil" }) {
  if (!abschnitte.length) return null;
  if (variante === "mobil") {
    return (
      <details className="tv-toc-mobile">
        <summary>Inhaltsverzeichnis</summary>
        <nav aria-label="Inhaltsverzeichnis (mobil)"><ul>{abschnitte.map((a) => <li key={a.id}><a href={`#${a.id}`}>{nn(a.nummer)} · {a.titel}</a></li>)}</ul></nav>
      </details>
    );
  }
  return (
    <nav aria-label="Inhaltsverzeichnis" className="sidebar">
      <div className="side-title">Inhalt</div>
      {abschnitte.map((a) => <a key={a.id} href={`#${a.id}`}>{nn(a.nummer)} · {a.titel}</a>)}
    </nav>
  );
}
