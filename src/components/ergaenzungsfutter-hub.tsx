import type { ReactNode } from "react";
import Link from "next/link";
import { AuthorCredit } from "@/components/author-credit";
import { ComparisonTable } from "@/components/comparison-table";
import { JsonLd } from "@/components/json-ld";
import {
  EF_HUB_AUTHOR,
  EF_HUB_FAQ,
  EF_HUB_H1,
  EF_HUB_RELATED_LINKS,
  EF_HUB_TOC,
  EF_HUB_UPDATED_ISO,
  EF_HUB_UPDATED_LABEL,
  hubFaqJsonLd,
  hubItemListJsonLd,
  purposesWithRows,
} from "@/lib/ergaenzungsfutter-hub";
import type { ComparisonTableRow, HubPurposeId } from "@/lib/comparison-table";
import "@/styles/vergleichstest.css";

export function ErgaenzungsfutterHub({
  groups,
  listing,
}: {
  groups: Partial<Record<HubPurposeId, ComparisonTableRow[]>>;
  listing: ReactNode;
}) {
  const purposes = purposesWithRows(groups);
  const itemList = hubItemListJsonLd(purposes.flatMap((p) => p.rows.map((row) => ({ name: row.name, href: row.href }))));
  const faq = hubFaqJsonLd();
  return (
    <article className="mx-auto max-w-6xl">
      {itemList ? <JsonLd data={itemList} /> : null}
      {faq ? <JsonLd data={faq} /> : null}
      <header className="max-w-3xl">
        <h1 className="mt-4 text-3xl font-extrabold md:text-5xl">{EF_HUB_H1}</h1>
        <p className="mt-3 text-sm text-muted">
          Von <AuthorCredit /> · Aktualisiert:{" "}
          <time dateTime={EF_HUB_UPDATED_ISO}>{EF_HUB_UPDATED_LABEL}</time>
          <span className="sr-only">, {EF_HUB_AUTHOR}</span>
        </p>
      </header>

      <nav aria-label="Inhaltsverzeichnis" className="mt-8 max-w-3xl rounded-2xl border border-border bg-surface p-5">
        <p className="text-sm font-extrabold uppercase tracking-wide text-muted">Inhalt</p>
        <ol className="mt-3 columns-1 gap-x-8 text-sm sm:columns-2">
          {EF_HUB_TOC.map((item) => (
            <li key={item.href} className="break-inside-avoid py-0.5">
              <a href={item.href} className="font-semibold text-brand underline-offset-2 hover:underline">
                {item.label}
              </a>
            </li>
          ))}
        </ol>
      </nav>

      <div className="prose-fp mt-10 max-w-3xl">
        <section id="ueberblick" aria-labelledby="ueberblick-heading">
          <h2 id="ueberblick-heading">Der Überblick</h2>
          <p>
            „Ergänzungsfutter Hund Test“ klingt, als gäbe es einen Sieger für alle Fälle. Den gibt es nicht. Ein{" "}
            <strong>Ergänzungsfuttermittel</strong> nach der Verordnung (EG) Nr. 767/2009 deckt den täglichen Bedarf allein
            nicht; es gehört zu einer Ration dazu. Ein <strong>Alleinfuttermittel</strong> soll sie allein tragen.
          </p>
          <p>
            Deshalb sortieren wir unsere Tests nach Zweck – Gelenke, Öl und Fell, Kotfressen, Verdauung, Zähne, Unruhe,
            Snacks. In jeder Tabelle stehen nur veröffentlichte Testergebnisse: Punkte, Ampel, Note nach dem Schlüssel von
            1,0 bis 6,0. Eine Dosis je Kilogramm oder einen Preis pro Tag nennen wir nur, wenn der Test sie belegt. Einen
            Gesamtsieger über diese Zwecke hinweg gibt es nicht.
          </p>
          <p>
            Wie wir rechnen, steht in der <Link href="/methodik/ergaenzungsfutter">Methodik für Ergänzungsfutter</Link>.
            Die Ampel Grün ist unsere Empfehlung; Gelb heißt mit Abstrichen, Rot ist keine Empfehlung.
          </p>
        </section>
      </div>

      {purposes.map((purpose) => (
        <section key={purpose.id} id={purpose.anchor} aria-labelledby={`${purpose.anchor}-heading`} className="mt-12">
          <h2 id={`${purpose.anchor}-heading`} className="text-2xl font-extrabold">
            {purpose.title}
          </h2>
          <p className="mt-3 max-w-3xl text-base text-muted">{purpose.intro}</p>
          {purpose.links.length > 0 && (
            <p className="mt-2 max-w-3xl text-sm">
              {purpose.links.map((link, index) => (
                <span key={link.href}>
                  {index > 0 ? " · " : null}
                  <Link href={link.href} className="font-semibold text-brand underline">
                    {link.label}
                  </Link>
                </span>
              ))}
            </p>
          )}
          <div className="mt-5 overflow-x-auto">
            <ComparisonTable rows={purpose.rows} caption={`Getestete Produkte zum Zweck ${purpose.title}`} />
          </div>
        </section>
      ))}

      <section id="kaufberatung" aria-labelledby="kaufberatung-heading" className="prose-fp mt-14 max-w-3xl">
        <h2 id="kaufberatung-heading">Kaufberatung: Worauf es bei Ergänzungsfutter ankommt</h2>
        <h3>Zuerst der Zweck, nicht der Bestseller</h3>
        <p>
          Der Amazon-Rang fasst Gelenktabletten, Lachsöl und Zahnsticks in eine Schublade. Unsere Tests nicht. Wer ein
          Öl sucht, braucht die Öltabelle; wer einen Kausnack sucht, die Snacktabelle. Ein Siegerkorb für „das beste
          Ergänzungsfutter“ wäre nach unserer Einschätzung eine Inszenierung, kein Vergleich.
        </p>
        <h3>Die Dosis je Kilogramm zählt, nicht die Zutatenliste allein</h3>
        <p>
          Ein Stoff auf der Packung sagt noch nicht, ob die Tagesmenge in die Nähe von Dosen aus Studien kommt. Wir
          rechnen die deklarierte Menge auf das Körpergewicht um, sobald die Angaben das hergeben. Fehlt die Menge,
          bleibt die Wirkung ein Versprechen ohne Maß.
        </p>
        <h3>Werbung darf kein Heilversprechen sein</h3>
        <p>
          Ergänzungsfuttermittel dürfen den Bedarf einer Ration ergänzen. Sie dürfen nach unserer Lesart der
          Futtermittelvorschriften keine Krankheiten heilen oder Diagnosen ersetzen. Wo eine Packung das trotzdem nahelegt,
          werten wir die Aussage – und stufen das Produkt in der Ampel nicht als Empfehlung.
        </p>
        <h3>Der Träger und der Preis pro Tag</h3>
        <p>
          Zucker, Füllstoffe und überflüssige Zusätze gehören zur Bewertung, nicht nur der beworbene Wirkstoff. Den Preis
          nennen wir als Betrag je Tagesdosis für einen Hund mit 10 kg, wenn der Test ihn belegt. Ein niedriger Kilopreis
          nützt nichts, wenn die Tagesmenge ein Loch in die Dose reißt.
        </p>
      </section>

      <section id="haeufige-fragen" aria-labelledby="faq-heading" className="mt-14 max-w-3xl">
        <h2 id="faq-heading" className="text-2xl font-extrabold">
          Häufige Fragen
        </h2>
        <dl className="mt-6 space-y-6">
          {EF_HUB_FAQ.map((item) => (
            <div key={item.question}>
              <dt className="text-lg font-extrabold">{item.question}</dt>
              <dd className="mt-2 text-base text-muted">{item.answer}</dd>
            </div>
          ))}
        </dl>
      </section>

      <nav aria-label="Weiterlesen" className="mt-14 max-w-3xl">
        <h2 className="text-2xl font-extrabold">Zum Weiterlesen</h2>
        <ul className="mt-4 list-disc space-y-2 pl-5 text-base">
          {EF_HUB_RELATED_LINKS.map((link) => (
            <li key={link.href}>
              <Link href={link.href} className="font-semibold text-brand underline">
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <section id="testergebnisse" aria-labelledby="testergebnisse-heading" className="mt-16">
        <h2 id="testergebnisse-heading" className="text-2xl font-extrabold">
          Alle Tests
        </h2>
        <p className="mb-8 mt-3 max-w-3xl text-base text-muted">
          Die Liste darunter ist filterbar. Oben stehen die Zweck-Tabellen mit Punkten, Ampel und Note. Snacks, Kauartikel
          und Zusätze ergänzen eine Ration – sie ersetzen sie nicht.
        </p>
        {listing}
      </section>
    </article>
  );
}
