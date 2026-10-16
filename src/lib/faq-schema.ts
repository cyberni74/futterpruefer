/** FAQPage nur für Fragen, die Frage und Antwort haben. Leere Listen ergeben kein Schema. */
export function faqPageJsonLd(items: { question: string; answer: string }[]) {
  const mainEntity = items
    .map((item) => ({ name: item.question.trim(), text: item.answer.trim() }))
    .filter((item) => item.name && item.text)
    .map((item) => ({
      "@type": "Question" as const,
      name: item.name,
      acceptedAnswer: { "@type": "Answer" as const, text: item.text },
    }));
  if (!mainEntity.length) return null;
  return { "@context": "https://schema.org", "@type": "FAQPage" as const, mainEntity };
}
