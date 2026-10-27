import type { LayoutData } from "./schema";

/** FAQ-Akkordeon. Dieselbe Liste (faqItems) speist das FAQPage-JSON-LD, sichtbar und im Schema 1:1. */
export function ProductFAQ({ faq }: { faq?: LayoutData["faq"] }) {
  if (!faq?.length) return null;
  return (
    <div>
      {faq.map((f) => (
        <details key={f.frage} className="faq"><summary>{f.frage}</summary><p>{f.antwort}</p></details>
      ))}
    </div>
  );
}
