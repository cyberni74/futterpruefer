import type { Metadata } from "next";
import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";
import { ArrowRight, Award, CalendarCheck, Clock, PawPrint, RefreshCw, Scale, UserRound } from "lucide-react";
import { prisma } from "@/lib/db";
import { getRelatedReviews, getReviewBySlug, previewDraftsEnabled, publishedWhere, resolveReviewPath } from "@/lib/queries";
import { getLexikonEntries, getPostsForReview, renderArticle } from "@/lib/content";
import { isRotScore } from "@/lib/rot-guard";
import { enhanceArticle } from "@/lib/article-html";
import { consWithClaims, misleadingClaims, parseAnalysis, parseClaims, readingMinutes } from "@/lib/product-data";
import { CRITERIA, type Scores } from "@/lib/scoring";
import { capNote, efBars, prepareErgaenzungArticle, renderStudienListe, scoreErgaenzung, studieDosisText, type EfInput } from "@/lib/ergaenzung";
import { productReviewJsonLd, reviewHeadline } from "@/lib/review-schema";
import { productLabel, seoTitle, trimMetaDescription } from "@/lib/seo";
import { brandPath, reviewPath } from "@/lib/urls";
import { absoluteUrl, ANIMAL_LABEL, formatDate, MONTHS, PRICE_CLASS_LABEL, SITE } from "@/lib/site";
import { contentAuthor } from "@/lib/attribution";
import { resolveAuthor } from "@/lib/authors";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { AuthorCredit } from "@/components/author-credit";
import { VerdictPanel } from "@/components/verdict-panel";
import { MisleadingClaimsBanner, WarningBanner } from "@/components/warning-banners";
import { TableOfContents } from "@/components/table-of-contents";
import { IngredientList } from "@/components/ingredient-list";
import { AnalysisTable } from "@/components/analysis-table";
import { PriceBlock } from "@/components/price-block";
import { ClaimsCheck } from "@/components/claims-check";
import { FpImage } from "@/components/fp-image";
import { isAmazonHotlink } from "@/lib/image-hosts";
import { ReadAloud } from "@/components/read-aloud";
import { ShareButtons } from "@/components/share-buttons";
import { ShareBar } from "@/components/share-bar";
import { AllLink } from "@/components/all-link";
import { ReviewCard } from "@/components/review-card";
import { BlogCard } from "@/components/blog-card";
import { NewsletterBox } from "@/components/newsletter-box";
import { WishBox } from "@/components/wish-box";
import { Disclosure } from "@/components/disclosure";
import { JsonLd } from "@/components/json-ld";
import { directAnswer, keywordName, kurzGesagt, renameBodyFazit, reviewFaq, seoFazitHeading, type ReviewSeoInput } from "@/lib/review-seo";
import { comparisonForReview } from "@/lib/comparison-links";
import { faqPageJsonLd } from "@/lib/faq-schema";
import "@/styles/vergleichstest.css";

export const revalidate = 3600;
/** Draft-Slugs stehen nicht in generateStaticParams und rendern auf der Preview on-demand. */
export const dynamicParams = true;

const isPublicReview = (r: { status: string; publishedAt: Date | null }) =>
  r.status === "PUBLISHED" && r.publishedAt != null && r.publishedAt.getTime() <= Date.now();

export async function generateStaticParams() {
  try {
    const rows = await prisma.review.findMany({ where: publishedWhere(), select: { slug: true, category: { select: { slug: true } } }, take: 500 });
    return rows.map((r) => ({ kategorie: r.category.slug, slug: r.slug }));
  } catch {
    return [];
  }
}

const autoDescription = (r: { title: string; totalScore: number; verdict: string }) =>
  trimMetaDescription(r.verdict?.trim() ? `${r.title} im Fachtest: ${r.totalScore}/100 Punkte. ${r.verdict}` : `${r.title} im Fachtest: ${r.totalScore}/100 Punkte. Rohstoffe, Schadstoffe, Nährstoffprofil, Deklaration und Preis-Leistung bewertet.`);

export async function generateMetadata({ params }: PageProps<"/[kategorie]/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const allowDrafts = previewDraftsEnabled();
  const r = await getReviewBySlug(slug, { includeDrafts: allowDrafts });
  if (!r) return {};
  const draft = allowDrafts && !isPublicReview(r);
  const title = r.metaTitle?.trim() || `${productLabel(r.brand, r.productName)} im Test: ${r.totalScore}/100`;
  const description = trimMetaDescription(r.metaDescription?.trim() || autoDescription(r));
  const path = reviewPath(r);
  return {
    title: { absolute: seoTitle(title) },
    description,
    keywords: r.keywords,
    alternates: { canonical: path },
    openGraph: { type: "article", title, description, url: path, modifiedTime: r.updatedAt.toISOString(), publishedTime: r.publishedAt?.toISOString(), authors: [resolveAuthor(r.authorSlug).name] },
    twitter: { card: "summary_large_image", title, description },
    ...(draft ? { robots: { index: false, follow: false, googleBot: { index: false, follow: false } } } : {}),
  };
}

function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section aria-labelledby={id} className="scroll-mt-28">
      <h3 id={id} className="mb-3 text-lg font-extrabold">{title}</h3>
      {children}
    </section>
  );
}

export default async function ReviewPage({ params }: PageProps<"/[kategorie]/[slug]">) {
  const { kategorie, slug } = await params;
  const allowDrafts = previewDraftsEnabled();
  const r = await getReviewBySlug(slug, { includeDrafts: allowDrafts });
  if (!r) {
    const path = await resolveReviewPath(slug);
    if (path) permanentRedirect(path);
    notFound();
  }
  // Kanonische URL erzwingen (falsche Kategorie im Pfad → 301)
  if (r.category.slug !== kategorie) permanentRedirect(reviewPath(r));

  const scores = Object.fromEntries(CRITERIA.map((c) => [c.key, r[c.key]])) as Scores;
  const efInput: EfInput | null = r.bewertungsart === "ERGAENZUNGSFUTTER" ? {
    auswahl: r.efWirkstoffAuswahl ?? 0,
    dosierung: r.efWirkstoffDosierung ?? 0,
    werbung: r.efWerbung ?? 0,
    traeger: r.efTraeger ?? 0,
    mengen: r.efTransparenzMengen ?? 0,
    unterlagen: r.efTransparenzUnterlagen ?? 0,
    alibi: r.efAlibiDosierung,
    keineReferenzdosis: r.efKeineReferenzdosis,
    heilaussage: r.efHeilaussage,
    sicherheit: r.efSicherheit,
  } : null;
  const efResult = efInput ? scoreErgaenzung(efInput) : null;
  const claims = parseClaims(r.claims);
  const misleading = misleadingClaims(claims);
  const analysis = parseAnalysis(r.analysis);

  const [related, posts, linked, conclusion, lexikon, pom] = await Promise.all([
    getRelatedReviews(r.categoryId, r.id, 3),
    getPostsForReview(r, 2),
    renderArticle(r.bodyHtml, [], { rot: isRotScore(r.totalScore) }),
    renderArticle(r.conclusionHtml, [], { rot: isRotScore(r.totalScore) }),
    getLexikonEntries(),
    prisma.productOfMonth.findFirst({ where: { reviewId: r.id }, orderBy: [{ year: "desc" }, { month: "desc" }] }),
  ]);
  const articleSource = efResult
    ? prepareErgaenzungArticle(linked, {
        studienHtml: renderStudienListe(r.studien.map((s) => ({
          wirkstoff: s.wirkstoff.name,
          autoren: s.autoren,
          jahr: s.jahr,
          titel: s.titel,
          zeitschrift: s.zeitschrift,
          tierart: s.tierart,
          evidenzstufe: s.evidenzstufe,
          dosis: studieDosisText({
            studiendosisJeKg: s.studiendosisJeKg == null ? null : Number(s.studiendosisJeKg.toString()),
            einheit: s.einheit ?? "",
            studiendosisOriginal: s.studiendosisOriginal,
          }),
          ergebnis: s.ergebnisKurz,
          link: s.link,
        }))),
        tierschutz: r.efTierschutzText,
        rot: efResult.ampel === "ROT",
      })
    : linked;
  const { html: body, toc } = enhanceArticle(renameBodyFazit(articleSource), efResult ? undefined : scores);
  const hasProductData = Boolean(r.composition?.trim() || analysis.length || r.price != null || r.pricePerKg != null || r.pricePerDay != null);
  const hasConclusion = Boolean(conclusion.trim());
  const tocItems = [...toc, { id: "fazit-test", text: "Fazit" }, { id: "faq-test", text: "Häufige Fragen" }, ...(hasProductData ? [{ id: "produktdaten", text: "Produktdaten" }] : []), ...(claims.length ? [{ id: "werbeaussagen-h", text: "Werbeversprechen im Faktencheck" }] : [])];
  const url = absoluteUrl(reviewPath(r));
  const testedAt = r.testedAt ?? r.publishedAt;
  const minutes = readingMinutes(r.bodyHtml, r.verdict);
  const images = [r.imageUrl, r.contentImageUrl, ...(r.gallery ?? [])].filter((x): x is string => Boolean(x));
  const name = productLabel(r.brand, r.productName);
  const gallery = (r.gallery ?? []).filter(Boolean);
  const seoInput: ReviewSeoInput = {
    name: keywordName(r.keyword, r.brand, name), totalScore: r.totalScore, testedAt, verdict: r.verdict, pros: r.pros, cons: consWithClaims(r.cons, claims), claims,
    price: r.price, packageSize: r.packageSize, pricePerKg: r.pricePerKg, pricePerDay: r.pricePerDay, priceDate: r.priceDate,
    composition: r.composition, ergaenzung: Boolean(efResult),
  };
  const moisture = analysis.find((a) => /feucht|wasser/i.test(a.name))?.value ?? null;
  const comparison = comparisonForReview({ title: r.title, productName: r.productName, keyword: r.keyword, categorySlug: r.category.slug, moisture });
  const faq = reviewFaq(seoInput, comparison);
  const faqLd = faqPageJsonLd(faq);
  const abs = (u: string) => (u.startsWith("http") ? u : absoluteUrl(u));
  const author = contentAuthor(r.authorSlug);
  const draftPreview = allowDrafts && !isPublicReview(r);
  const amazonListing = [r.imageUrl, r.contentImageUrl].some((src) => src != null && isAmazonHotlink(src));

  return (
    <div className="mx-auto max-w-6xl px-4">
      {draftPreview && (
        <p role="status" className="mt-4 rounded-2xl border-2 border-bad bg-bad-soft p-5 text-lg font-extrabold text-bad">
          Entwurf – nicht veröffentlicht, Rechtsprüfung ausstehend
        </p>
      )}
      <JsonLd
        data={[
          productReviewJsonLd({
            brand: r.brand,
            productName: r.productName,
            categoryName: r.category.name,
            description: trimMetaDescription(r.metaDescription?.trim() || autoDescription(r)),
            totalScore: r.totalScore,
            verdict: r.verdict,
            publishedAt: r.publishedAt,
            updatedAt: r.updatedAt,
            authorSlug: r.authorSlug,
            images,
            pros: r.pros,
            cons: consWithClaims(r.cons, claims),
            price: r.price == null ? null : Number(r.price),
            url,
          }),
          {
            "@context": "https://schema.org",
            "@type": "Article",
            headline: reviewHeadline(name),
            description: trimMetaDescription(r.metaDescription?.trim() || autoDescription(r)),
            datePublished: r.publishedAt?.toISOString(),
            dateModified: r.updatedAt.toISOString(),
            inLanguage: "de-DE",
            mainEntityOfPage: url,
            ...(images.length ? { image: images.map(abs) } : {}),
            author,
            publisher: { "@type": "Organization", name: SITE.name, url: SITE.url, logo: { "@type": "ImageObject", url: absoluteUrl("/brand/logo-round-512.png") } },
          },
        ]}
      />
      <Breadcrumbs items={[{ label: r.category.name, href: `/${r.category.slug}` }, { label: name, href: reviewPath(r) }]} />

      <div className="mt-4 lg:grid lg:grid-cols-[minmax(0,1fr)_17rem] lg:gap-10">
        <article className="min-w-0">
          {/* 2. Kopfbereich */}
          <header>
            <div className="flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-soft px-3 py-1 text-xs font-bold text-brand-strong"><PawPrint className="size-3.5" aria-hidden />{ANIMAL_LABEL[r.category.animal]}</span>
              <Link href={`/${r.category.slug}`} className="inline-flex items-center rounded-full border border-border px-3 py-1 text-xs font-bold hover:bg-bg-soft">{r.category.name}</Link>
              {r.brand && <Link href={brandPath(r.brand)} className="inline-flex items-center rounded-full border border-border px-3 py-1 text-xs font-bold hover:bg-bg-soft">Marke: {r.brand}</Link>}
              {pom && (
                <Link href="/produkt-des-monats" className="inline-flex items-center gap-1.5 rounded-full bg-accent px-3 py-1 text-xs font-bold text-white dark:text-black hover:bg-accent-strong"><Award className="size-3.5" aria-hidden />Produkt des Monats {MONTHS[pom.month - 1]} {pom.year}</Link>
              )}
            </div>
            <h1 className="mt-3 text-3xl font-extrabold leading-tight md:text-5xl">{name} im Test</h1>
            <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted">
              <li className="flex items-center gap-1.5"><UserRound className="size-4" aria-hidden />Von <AuthorCredit slug={r.authorSlug} /></li>
              {testedAt && <li className="flex items-center gap-1.5"><CalendarCheck className="size-4" aria-hidden />Getestet am <time dateTime={testedAt.toISOString()}>{formatDate(testedAt)}</time></li>}
              <li className="flex items-center gap-1.5"><RefreshCw className="size-4" aria-hidden />Zuletzt aktualisiert <time dateTime={r.updatedAt.toISOString()}>{formatDate(r.updatedAt)}</time></li>
              <li className="flex items-center gap-1.5"><Clock className="size-4" aria-hidden />{minutes} Min. Lesezeit</li>
            </ul>
            {(r.imageUrl || r.contentImageUrl) && (
              <div className={`mt-6 grid gap-3 ${r.imageUrl && r.contentImageUrl ? "sm:grid-cols-2" : ""}`}>
                {r.imageUrl && (
                  <figure>
                    <div className="relative aspect-[4/3] overflow-hidden rounded-3xl bg-bg-soft">
                      <FpImage src={r.imageUrl} alt={r.imageAlt.trim() || `Verpackung von ${name}`} blur={r.imageBlur} sizes={r.contentImageUrl ? "(min-width:1024px) 380px, (min-width:640px) 50vw, 100vw" : "(min-width:1024px) 760px, 100vw"} priority />
                    </div>
                    <figcaption className="mt-1.5 text-sm text-muted">Verpackung</figcaption>
                  </figure>
                )}
                {r.contentImageUrl && (
                  <figure>
                    <div className="relative aspect-[4/3] overflow-hidden rounded-3xl bg-bg-soft">
                      <FpImage src={r.contentImageUrl} alt={r.contentImageAlt.trim() || `Inhalt von ${name} ohne Verpackung`} blur={r.contentImageBlur} sizes={r.imageUrl ? "(min-width:1024px) 380px, (min-width:640px) 50vw, 100vw" : "(min-width:1024px) 760px, 100vw"} priority={!r.imageUrl} />
                    </div>
                    <figcaption className="mt-1.5 text-sm text-muted">Das Futter selbst</figcaption>
                  </figure>
                )}
              </div>
            )}
            {gallery.length > 0 && (
              <ul className="mt-3 flex gap-3 overflow-x-auto pb-1" aria-label="Weitere Produktbilder">
                {gallery.map((src, i) => (
                  <li key={src} className="relative aspect-square w-24 shrink-0 overflow-hidden rounded-xl bg-bg-soft">
                    <FpImage src={src} alt={`${name} – weiteres Bild ${i + 1}`} sizes="96px" />
                  </li>
                ))}
              </ul>
            )}
            <div className="mt-5"><ReadAloud targetId="testbericht" /></div>
          </header>

          {/* 3. / 3b. Warnhinweise */}
          {(misleading.length > 0 || (efResult ? efResult.warnsignal : r.scoreHarmful < 10)) && (
            <div className="mt-6 space-y-3">
              {efResult ? (
                efResult.warnsignal ? <WarningBanner scoreHarmful={0} title="Warnhinweis: Sicherheit" reason={r.efSicherheitBegruendung} /> : null
              ) : (
                <WarningBanner scoreHarmful={r.scoreHarmful} reason={r.harmfulReason} />
              )}
              <MisleadingClaimsBanner count={misleading.length} />
            </div>
          )}

          {/* 4. Fazit */}
          <div className="mt-6">
            <VerdictPanel
              data={{ ...scores, totalScore: r.totalScore, verdict: r.verdict, pros: r.pros, cons: consWithClaims(r.cons, claims), updatedAt: r.updatedAt }}
              bars={efInput && efResult ? efBars(efInput, efResult) : undefined}
              capNote={efResult ? capNote(efResult) || undefined : undefined}
            />
          </div>

          {/* 5. Inhaltsverzeichnis (mobil) */}
          <div className="mt-8"><TableOfContents items={tocItems} variant="mobile" /></div>

          {/* 6. Artikeltext */}
          <div id="testbericht" className="mt-8">
            {body && <div className="prose-fp" dangerouslySetInnerHTML={{ __html: body }} />}
            <p className="mt-6 rounded-2xl bg-bg-soft p-4 text-sm text-muted">Unterstrichene Begriffe sind im <Link href="/lexikon" className="font-semibold text-brand underline">Futter-Lexikon</Link> bzw. im <Link href="/glossar" className="font-semibold text-brand underline">Glossar</Link> erklärt. Der farbige Punkt zeigt die Bedenklichkeits-Ampel.</p>
          </div>

          <section id="fazit-test" aria-labelledby="fazit-h" className="mt-10 scroll-mt-28 rounded-3xl border border-border bg-bg-soft p-5 md:p-8">
            <h2 id="fazit-h" className="text-2xl font-extrabold">{seoFazitHeading(seoInput.name, testedAt)}</h2>
            <div className="prose-fp mt-3">
              <p><strong>{directAnswer(seoInput)}</strong></p>
              <div className="fp-box fp-kurz space-y-3 rounded-3xl border-2 border-brand bg-brand-soft p-5">
                <p className="font-extrabold">📌 Kurz gesagt</p>
                <ul>{kurzGesagt(seoInput).map((t) => <li key={t}>{t}</li>)}</ul>
              </div>
              {hasConclusion ? <div dangerouslySetInnerHTML={{ __html: conclusion }} /> : r.verdict?.trim() ? <p>{r.verdict.trim()}</p> : null}
            </div>
          </section>

          {comparison && (
            <p className="mt-6 rounded-2xl border border-border bg-surface p-4 text-sm">
              <strong>Zum Vergleichstest:</strong>{" "}
              <Link href={comparison.href} className="font-semibold text-brand underline">{comparison.title}</Link>
            </p>
          )}

          <section id="faq-test" aria-labelledby="faq-h" className="mt-10 scroll-mt-28">
            <div className="prose-fp">
              <div className="fp-box vt-faq">
                <h2 id="faq-h">Häufige Fragen zu {seoInput.name}</h2>
                {faq.map((f) => (
                  <details key={f.question} className="vt-acc vt-faq-item"><summary>{f.question}</summary><p>{f.answer}</p></details>
                ))}
              </div>
            </div>
            {faqLd && <JsonLd data={faqLd} />}
          </section>

          {/* 7. Produktdaten */}
          {hasProductData && (
            <section aria-labelledby="produktdaten" className="mt-12 scroll-mt-28 space-y-8 rounded-3xl border border-border bg-surface p-5 shadow-card md:p-8">
              <h2 id="produktdaten" className="text-2xl font-extrabold">Produktdaten</h2>
              {r.composition?.trim() && (
                <Section id="zusammensetzung" title="Zusammensetzung">
                  <IngredientList composition={r.composition} lexikon={lexikon} />
                  <p className="mt-3 text-xs text-muted">Reihenfolge wie deklariert. Farbiger Punkt = Ampel aus dem Futter-Lexikon (grün unbedenklich, gelb eingeschränkt, rot bedenklich).</p>
                </Section>
              )}
              {analysis.length > 0 && (
                <Section id="analyse" title="Analytische Bestandteile">
                  <AnalysisTable rows={analysis} />
                </Section>
              )}
              {(r.price != null || r.pricePerKg != null || r.pricePerDay != null) && (
                <Section id="preis" title={`Preis${r.priceClass ? ` · Preisklasse ${PRICE_CLASS_LABEL[r.priceClass]}` : ""}`}>
                  <PriceBlock price={r.price} packageSize={r.packageSize} pricePerKg={r.pricePerKg} pricePerDay={r.pricePerDay} priceDate={r.priceDate} />
                </Section>
              )}
            </section>
          )}

          {/* 7b. Werbeaussagen-Check */}
          {claims.length > 0 && (
            <div className="mt-12"><ClaimsCheck claims={claims} brand={r.brand} sourceLabel={amazonListing ? `Die folgenden Sätze stehen im Amazon-Listing zu ${r.brand}. Wer sie dort eingetragen hat, ist uns nicht bekannt.` : undefined} /></div>
          )}

          {/* 8. Teilen */}
          <div className="mt-12">
            <p className="mb-3 text-sm font-bold">Diesen Test teilen</p>
            <ShareButtons url={url} title={`${name} im Test – ${r.totalScore}/100 Punkte`} />
          </div>
          <ShareBar url={url} title={`${name} im Test – ${r.totalScore}/100 Punkte`} />

          {/* 9. Call-to-Actions */}
          {related.length > 0 && (
            <section aria-labelledby="aehnliche" className="mt-16">
              <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
                <h2 id="aehnliche" className="text-2xl font-extrabold">Ähnliche Produkte im Vergleich</h2>
                <Link href={`/vergleich?ids=${[r.id, ...related.slice(0, 2).map((x) => x.id)].join(",")}`} className="inline-flex min-h-11 items-center gap-2 rounded-full bg-accent px-5 text-sm font-bold text-white hover:bg-accent-strong dark:text-black">
                  <Scale className="size-4" aria-hidden /> Direkt vergleichen
                </Link>
              </div>
              <h3 className="sr-only">Verwandte Tests</h3>
              <ul className="grid gap-x-5 gap-y-8 sm:grid-cols-2 xl:grid-cols-3">{related.map((x) => <li key={x.id}><ReviewCard review={x} /></li>)}</ul>
              <Link href={`/${r.category.slug}`} className="mt-6 inline-flex min-h-11 items-center gap-1 font-bold text-brand hover:underline">
                Alle Tests: {r.category.name} <ArrowRight className="size-4" aria-hidden />
              </Link>
            </section>
          )}
          {posts.length > 0 && (
            <section aria-labelledby="fachartikel" className="mt-16">
              <h2 id="fachartikel" className="mb-6 text-2xl font-extrabold">Passende Fachartikel</h2>
              <ul className="grid gap-5 sm:grid-cols-2">{posts.map((p) => <li key={p.id}><BlogCard post={p} /></li>)}</ul>
          <AllLink href="/blog" title="Mehr Wissen für den Napf" text="Ratgeber zu Zutaten, Fütterung und Gesundheit, verständlich und mit Quellen. Lesen Sie weiter im Fachblog.">Alle Beiträge im Fachblog</AllLink>
            </section>
          )}
          <div className="mt-16"><WishBox /></div>
        <div className="mt-16"><NewsletterBox /></div>

          {/* 10. Offenlegung */}
          <div className="mt-8"><Disclosure /></div>
        </article>

        {/* 5. Inhaltsverzeichnis (Desktop, sticky) */}
        <aside className="hidden lg:block">
          <TableOfContents items={tocItems} variant="desktop" />
        </aside>
      </div>
    </div>
  );
}
