"use client";
import { Link2, RefreshCw } from "lucide-react";
import { startTransition, useActionState, useRef, useState } from "react";
import { VerdictPanel } from "@/components/verdict-panel";
import { consWithClaims, type Claim } from "@/lib/product-data";
import { AnalysisField, ClaimsField, GalleryField } from "./product-data-fields";
import { CRITERIA, MAX_TOTAL, clampScore, totalScore, type CriterionKey, type Scores } from "@/lib/scoring";
import { slugify } from "@/lib/slug";
import { PRICE_CLASS_LABEL } from "@/lib/site";
import type { ActionResult } from "@/lib/admin/schemas";
import type { PublishMode } from "@/lib/admin/publish";
import { stripTags } from "@/lib/admin/text";
import { EditorHeader, SaveBar, useFocusFirstError } from "./editor-shell";
import { ImageField } from "./image-field";
import { ListInput } from "./list-input";
import { PublishField } from "./publish-field";
import { RichEditor } from "./rich-editor";
import { SeoPanel } from "./seo-panel";
import { Field, Section, describe, inputCls, textareaCls } from "./ui";

export type ReviewEditorData = {
  id?: string;
  title: string;
  slug: string;
  brand: string;
  productName: string;
  keyword: string;
  categoryId: string;
  priceClass: "GUENSTIG" | "MITTEL" | "PREMIUM";
  pricePerKg: string;
  imageUrl: string | null;
  imageAlt: string;
  imageBlur: string | null;
  contentImageUrl: string | null;
  contentImageAlt: string;
  contentImageBlur: string | null;
  scores: Scores;
  verdict: string;
  teaser: string;
  harmfulReason: string;
  composition: string;
  analysis: Array<{ name: string; value: number }>;
  packageSize: string;
  price: string;
  pricePerDay: string;
  priceDate: string;
  testedAt: string;
  gallery: string[];
  claims: Claim[];
  pros: string[];
  cons: string[];
  bodyHtml: string;
  conclusionHtml: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  publishMode: PublishMode;
  scheduledAt: string;
  updatedAt: string | null;
};

type Props = {
  initial: ReviewEditorData;
  categories: { id: string; name: string; slug: string }[];
  /** bereits angelegte Marken für das Auswahlfeld */
  brands?: string[];
  action: (prev: ActionResult | null, fd: FormData) => Promise<ActionResult>;
  badge?: React.ReactNode;
  deleteSlot?: React.ReactNode;
  justCreated?: boolean;
};

const FORM_ID = "review-form";

function padList(list: string[], min = 2) {
  const out = [...list];
  while (out.length < min) out.push("");
  return out;
}

export function ReviewEditor({ initial, categories, brands = [], action, badge, deleteSlot, justCreated }: Props) {
  const isNew = !initial.id;
  const [state, formAction, pending] = useActionState(
    action,
    justCreated ? { ok: true, message: "Test angelegt und gespeichert.", at: 0 } : null,
  );
  const formRef = useFocusFirstError(state);
  const errors = state?.fieldErrors ?? {};

  const [title, setTitle] = useState(initial.title);
  const [slug, setSlug] = useState(initial.slug);
  const [slugTouched, setSlugTouched] = useState(!isNew);
  const [brand, setBrand] = useState(initial.brand);
  const [productName, setProductName] = useState(initial.productName);
  const [keyword, setKeyword] = useState(initial.keyword);
  const [categoryId, setCategoryId] = useState(initial.categoryId);
  const [priceClass, setPriceClass] = useState(initial.priceClass);
  const [pricePerKg, setPricePerKg] = useState(initial.pricePerKg);
  const [scores, setScores] = useState<Record<CriterionKey, string>>(
    () => Object.fromEntries(CRITERIA.map((c) => [c.key, String(initial.scores[c.key] ?? 0)])) as Record<CriterionKey, string>,
  );
  const [verdict, setVerdict] = useState(initial.verdict);
  const [teaser, setTeaser] = useState(initial.teaser);
  const [harmfulReason, setHarmfulReason] = useState(initial.harmfulReason);
  const [claims, setClaims] = useState<Claim[]>(initial.claims ?? []);
  const [pros, setPros] = useState(() => padList(initial.pros));
  const [cons, setCons] = useState(() => padList(initial.cons));
  const [mode, setMode] = useState<PublishMode>(initial.publishMode);
  const [scheduledAt, setScheduledAt] = useState(initial.scheduledAt);
  const [tab, setTab] = useState<"form" | "preview">("form");
  const bodyRef = useRef(initial.bodyHtml);

  const numericScores = Object.fromEntries(CRITERIA.map((c) => [c.key, clampScore(c.key, scores[c.key])])) as Scores;
  const total = totalScore(numericScores);
  const productLabel = [brand, productName].filter(Boolean).join(" ");

  const scoreError = (key: CriterionKey, max: number): string | undefined => {
    const raw = scores[key];
    if (errors[key]) return errors[key];
    if (raw === "") return undefined;
    const n = Number(raw);
    if (!Number.isFinite(n) || !Number.isInteger(n)) return "Nur ganze Punkte.";
    if (n < 0) return "Mindestens 0 Punkte.";
    if (n > max) return `Maximal ${max} Punkte.`;
    return undefined;
  };
  const hasClientScoreError = CRITERIA.some((c) => !!scoreError(c.key, c.max) && !errors[c.key]);

  const previewData = {
    ...numericScores,
    totalScore: total,
    verdict,
    pros: pros.map((p) => p.trim()).filter(Boolean),
    cons: consWithClaims(cons.map((p) => p.trim()).filter(Boolean), claims.filter((c) => c.claim.trim())),
    updatedAt: initial.updatedAt,
    harmfulReason,
  };
  const catSlug = categories.find((c) => c.id === categoryId)?.slug ?? "kategorie";
  const declarationMax = CRITERIA.find((c) => c.key === "scoreDeclaration")!.max;

  return (
    <div>
      <EditorHeader
        formId={FORM_ID}
        backHref="/admin/tests"
        backLabel="Alle Tests"
        title={isNew ? "Neuer Test" : title || "Test bearbeiten"}
        badge={badge}
        previewHref={initial.id ? `/admin/vorschau/tests/${initial.id}` : undefined}
        pending={pending}
      />

      <div role="tablist" aria-label="Ansicht" className="mb-4 grid grid-cols-2 gap-1 rounded-xl border border-border bg-bg-soft p-1 lg:hidden">
        {(["form", "preview"] as const).map((t) => (
          <button
            key={t}
            type="button"
            role="tab"
            aria-selected={tab === t}
            aria-controls={t === "form" ? "pane-form" : "pane-preview"}
            onClick={() => setTab(t)}
            className={`min-h-11 rounded-lg text-sm font-semibold ${tab === t ? "bg-surface text-fg shadow-card" : "text-muted"}`}
          >
            {t === "form" ? "Bearbeiten" : `Fazit-Vorschau (${total})`}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] xl:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]">
        <form
          id={FORM_ID}
          ref={formRef}
          onSubmit={(e) => {
            // Kein natives Formular-Reset nach der Action (würde kontrollierte Selects/Radios desynchronisieren)
            e.preventDefault();
            if (hasClientScoreError) {
              setTab("form");
              formRef.current?.querySelector<HTMLElement>("[aria-invalid='true']")?.focus();
              return;
            }
            const fd = new FormData(e.currentTarget);
            startTransition(() => formAction(fd));
          }}
          className={`min-w-0 space-y-6 ${tab === "form" ? "" : "hidden lg:block"}`}
          noValidate
        >
          <div id="pane-form" className="space-y-6">
            <Section title="Produkt & Stammdaten" id="sec-basis">
              <Field id="title" label="Titel *" error={errors.title}>
                <input
                  id="title"
                  name="title"
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value);
                    if (!slugTouched) setSlug(slugify(e.target.value));
                  }}
                  required
                  maxLength={160}
                  className={inputCls}
                  {...describe("title", errors.title)}
                />
              </Field>
              <Field
                id="slug"
                label="Slug (URL)"
                error={errors.slug}
                hint={
                  !isNew && slug !== initial.slug ? (
                    <span className="font-semibold break-all text-mid">Neue URL – die bisherige Adresse wird automatisch weitergeleitet (301).</span>
                  ) : (
                    <span className="break-all">futterpruefer.de/{catSlug}/{slug || "…"}</span>
                  )
                }
              >
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Link2 className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted" aria-hidden />
                    <input
                      id="slug"
                      name="slug"
                      value={slug}
                      onChange={(e) => {
                        setSlugTouched(true);
                        setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-"));
                      }}
                      onBlur={() => setSlug((s) => slugify(s))}
                      required
                      maxLength={80}
                      className={`${inputCls} pl-9 font-mono text-sm`}
                      {...describe("slug", errors.slug, true)}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setSlug(slugify(title));
                      setSlugTouched(isNew ? false : true);
                    }}
                    className="inline-flex size-11 shrink-0 items-center justify-center rounded-xl border border-border hover:bg-bg-soft"
                    aria-label="Slug aus Titel neu erzeugen"
                    title="Slug aus Titel neu erzeugen"
                  >
                    <RefreshCw className="size-4" aria-hidden />
                  </button>
                </div>
              </Field>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field id="brand" label="Marke *" error={errors.brand}>
                  <BrandField brands={brands} value={brand} onChange={setBrand} error={errors.brand} />
                </Field>
                <Field id="productName" label="Produktname *" error={errors.productName}>
                  <input
                    id="productName"
                    name="productName"
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    required
                    maxLength={160}
                    className={inputCls}
                    {...describe("productName", errors.productName)}
                  />
                </Field>
                <Field id="keyword" label="Stichwort" error={errors.keyword} hint="Haupt-Suchbegriff, z. B. „Rinti Kennerfleisch“">
                  <input id="keyword" name="keyword" value={keyword} onChange={(e) => setKeyword(e.target.value)} maxLength={80} className={inputCls} {...describe("keyword", errors.keyword, true)} />
                </Field>
                <Field id="categoryId" label="Kategorie *" error={errors.categoryId}>
                  <select id="categoryId" name="categoryId" value={categoryId} onChange={(e) => setCategoryId(e.target.value)} required className={inputCls} {...describe("categoryId", errors.categoryId)}>
                    <option value="">Bitte wählen …</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field id="priceClass" label="Preisklasse" error={errors.priceClass}>
                  <select id="priceClass" name="priceClass" value={priceClass} onChange={(e) => setPriceClass(e.target.value as ReviewEditorData["priceClass"])} className={inputCls}>
                    {Object.entries(PRICE_CLASS_LABEL).map(([k, l]) => (
                      <option key={k} value={k}>
                        {l}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field id="pricePerKg" label="Preis pro kg (€)" error={errors.pricePerKg} hint="z. B. 12,90">
                  <input
                    id="pricePerKg"
                    name="pricePerKg"
                    value={pricePerKg}
                    onChange={(e) => setPricePerKg(e.target.value)}
                    inputMode="decimal"
                    maxLength={12}
                    className={inputCls}
                    {...describe("pricePerKg", errors.pricePerKg, true)}
                  />
                </Field>
              </div>
            </Section>

            <Section title="Produktbilder" id="sec-bild" description="Zwei Pflichtbilder je Test: die Verpackung (Hauptbild, Vorschaukarten, Social-Media-Bild) und das Futter selbst ohne Verpackung (Kroketten, Brocken, Tropfen …).">
              <div className="space-y-8">
                <ImageField
                  kind="review"
                  label="Bild 1: Verpackung"
                  nameSource={productLabel || title}
                  initialUrl={initial.imageUrl}
                  initialAlt={initial.imageAlt}
                  initialBlur={initial.imageBlur}
                  errors={errors}
                />
                <ImageField
                  kind="review"
                  prefix="contentImage"
                  label="Bild 2: Produkt selbst (Kroketten, Brocken, Tropfen …)"
                  nameSource={productLabel || title}
                  initialUrl={initial.contentImageUrl}
                  initialAlt={initial.contentImageAlt}
                  initialBlur={initial.contentImageBlur}
                  errors={errors}
                />
              </div>
            </Section>

            <Section title="Weitere Produktbilder" id="sec-galerie">
              <GalleryField initial={initial.gallery} nameSource={productLabel || title} error={errors.gallery} />
            </Section>

            <Section title="Bewertungsmaske" id="sec-bewertung" description={`Punkte je Kriterium – die Gesamtwertung (max. ${MAX_TOTAL}) wird automatisch berechnet.`}>
              <div className="space-y-5">
                {CRITERIA.map((c) => {
                  const err = scoreError(c.key, c.max);
                  const n = numericScores[c.key];
                  return (
                    <div key={c.key}>
                      <div className="flex items-center justify-between gap-3">
                        <label htmlFor={c.key} className="text-sm font-semibold">
                          {c.label} <span className="font-normal text-muted">(max. {c.max})</span>
                        </label>
                        <input
                          id={c.key}
                          name={c.key}
                          type="number"
                          inputMode="numeric"
                          min={0}
                          max={c.max}
                          step={1}
                          value={scores[c.key]}
                          onChange={(e) => setScores((s) => ({ ...s, [c.key]: e.target.value }))}
                          className={`${inputCls.replace("w-full", "")} w-24 shrink-0 text-right tabular-nums`}
                          {...describe(c.key, err)}
                        />
                      </div>
                      <input
                        type="range"
                        min={0}
                        max={c.max}
                        step={1}
                        value={n}
                        onChange={(e) => setScores((s) => ({ ...s, [c.key]: e.target.value }))}
                        aria-label={`${c.label} Schieberegler`}
                        aria-valuetext={`${n} von ${c.max} Punkten`}
                        className="mt-2 h-11 w-full accent-[var(--brand)]"
                      />
                      <p className="text-xs text-muted">{c.description}</p>
                      {err && (
                        <p id={`${c.key}-error`} className="mt-1 text-sm font-medium text-bad">
                          {err}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
              <div className="flex items-center justify-between rounded-xl bg-brand-soft px-4 py-3" aria-live="polite">
                <span className="font-semibold">Gesamtwertung</span>
                <span className="font-display text-2xl font-extrabold tabular-nums text-brand">
                  {total} <span className="text-base font-semibold text-muted">/ {MAX_TOTAL}</span>
                </span>
              </div>
            </Section>

            <Section title="Warnhinweis Schadstoffe" id="sec-warnung" description="Pflicht, wenn „Schadstoffe & Bedenkliches“ unter 10 Punkten liegt – erscheint als rote Warnbox über dem Fazit.">
              <Field id="harmfulReason" label={`Kurzbegründung${numericScores.scoreHarmful < 10 ? " *" : ""}`} error={errors.harmfulReason} hint={`${harmfulReason.length}/400 Zeichen`}>
                <textarea id="harmfulReason" name="harmfulReason" value={harmfulReason} onChange={(e) => setHarmfulReason(e.target.value)} rows={2} maxLength={400} className={textareaCls} placeholder="z. B. Enthält zugesetzten Zucker und das synthetische Antioxidans BHA." {...describe("harmfulReason", errors.harmfulReason, true)} />
              </Field>
            </Section>

            <Section title="Produktdaten" id="sec-produktdaten" description="Erscheint als eigener Block auf der Testseite. Leere Felder werden ausgeblendet.">
              <div className="grid gap-4 sm:grid-cols-2">
                <Field id="testedAt" label="Getestet am" error={errors.testedAt}>
                  <input id="testedAt" name="testedAt" type="date" defaultValue={initial.testedAt} className={inputCls} />
                </Field>
                <Field id="packageSize" label="Gebinde" error={errors.packageSize} hint="z. B. 400 g, 12 kg">
                  <input id="packageSize" name="packageSize" defaultValue={initial.packageSize} maxLength={40} className={inputCls} />
                </Field>
              </div>
              <Field id="composition" label="Zusammensetzung (wie auf dem Etikett)" error={errors.composition} hint="Kommagetrennt. Stoffe mit Lexikon-Eintrag werden automatisch verlinkt und mit Ampel markiert.">
                <textarea id="composition" name="composition" defaultValue={initial.composition} rows={4} maxLength={3000} className={textareaCls} placeholder="Rind (60 %), Reis, Lachsöl, Mineralstoffe" />
              </Field>
              <AnalysisField initial={initial.analysis} error={errors.analysis} />
              <div className="grid gap-4 sm:grid-cols-3">
                <Field id="price" label="Packungspreis (€)" error={errors.price}>
                  <input id="price" name="price" defaultValue={initial.price} inputMode="decimal" maxLength={12} className={inputCls} />
                </Field>
                <Field id="pricePerDay" label="Pro Tagesration (€)" error={errors.pricePerDay}>
                  <input id="pricePerDay" name="pricePerDay" defaultValue={initial.pricePerDay} inputMode="decimal" maxLength={12} className={inputCls} />
                </Field>
                <Field id="priceDate" label="Preisstand" error={errors.priceDate}>
                  <input id="priceDate" name="priceDate" type="date" defaultValue={initial.priceDate} className={inputCls} />
                </Field>
              </div>
            </Section>

            <Section title="Werbeaussagen-Check" id="sec-werbeaussagen" description="Jede Herstelleraussage mit Bewertung und Begründung. Unzulässige Aussagen lösen eine orange Warnbox aus.">
              <ClaimsField nameSource={productLabel || title}
                claims={claims}
                setClaims={setClaims}
                error={errors.claims}
                declarationMax={declarationMax}
                onApplyDeduction={(v) => setScores((s) => ({ ...s, scoreDeclaration: String(v) }))}
              />
            </Section>

            <Section title="Fazit, Pro & Contra" id="sec-fazit">
              <Field id="teaser" label="Teaser für die Vorschau-Karte (neugierig machen, max. 100 Zeichen = drei Zeilen)" error={errors.teaser} hint={`${teaser.length}/100 Zeichen – erscheint auf Startseite, Testübersicht und Kategorien unter dem Titel`}>
                <textarea id="teaser" name="teaser" value={teaser} onChange={(e) => setTeaser(e.target.value)} rows={2} maxLength={100} placeholder="z. B. Lachs im Namen – aber nur 4 % in der Tüte. Trotzdem 76 Punkte." className={textareaCls} {...describe("teaser", errors.teaser, true)} />
              </Field>
              <Field id="verdict" label="Fazit (1–2 Sätze)" error={errors.verdict} hint={`${verdict.length}/400 Zeichen`}>
                <textarea id="verdict" name="verdict" value={verdict} onChange={(e) => setVerdict(e.target.value)} rows={3} maxLength={400} className={textareaCls} {...describe("verdict", errors.verdict, true)} />
              </Field>
              <div className="grid gap-5 md:grid-cols-2">
                <ListInput name="pros" label="Pro" items={pros} onChange={setPros} error={errors.pros} tone="good" />
                <ListInput name="cons" label="Contra" items={cons} onChange={setCons} error={errors.cons} tone="bad" />
              </div>
              <p className="text-xs text-muted">Zum Veröffentlichen: Fazit sowie je 2–3 Pro- und Contra-Punkte.</p>
            </Section>

            <Section title="Testbericht" id="sec-text">
              <RichEditor name="bodyHtml" id="bodyHtml" label="Testbericht" initialHtml={initial.bodyHtml} onChange={(h) => (bodyRef.current = h)} />
              {errors.bodyHtml && <p className="text-sm font-medium text-bad">{errors.bodyHtml}</p>}
              <div className="mt-6">
                <RichEditor name="conclusionHtml" id="conclusionHtml" label="Ausführliches Fazit (optional, erscheint als eigener Abschnitt „Fazit“ nach dem Testbericht)" initialHtml={initial.conclusionHtml} />
                {errors.conclusionHtml && <p className="text-sm font-medium text-bad">{errors.conclusionHtml}</p>}
              </div>
            </Section>

            <Section title="SEO" id="sec-seo">
              <SeoPanel
                kind="review"
                slug={slug}
                fallbackTitle={title}
                fallbackDescription={verdict}
                initial={{ metaTitle: initial.metaTitle, metaDescription: initial.metaDescription, keywords: initial.keywords }}
                errors={errors}
                getContext={() => ({ title, brand, productName, keyword, verdict, body: stripTags(bodyRef.current) })}
              />
            </Section>

            <Section title="Veröffentlichung" id="sec-status">
              <PublishField mode={mode} onModeChange={setMode} scheduledAt={scheduledAt} onScheduledAtChange={setScheduledAt} error={errors.scheduledAt} />
            </Section>
          </div>

          <SaveBar pending={pending} state={state} />
        </form>

        <aside id="pane-preview" aria-label="Live-Vorschau des Fazits" className={`min-w-0 ${tab === "preview" ? "" : "hidden lg:block"}`}>
          <div className="lg:sticky lg:top-6">
            <p className="mb-2 text-xs font-bold tracking-wide text-muted uppercase">Live-Vorschau · so erscheint das Fazit</p>
            <VerdictPanel data={previewData} showWarning />
            <button type="button" onClick={() => setTab("form")} className="mt-4 min-h-11 w-full rounded-xl border border-border text-sm font-semibold lg:hidden">
              Zurück zum Formular
            </button>
          </div>
        </aside>
      </div>

      {deleteSlot && <div className="mt-10 border-t border-border pt-6">{deleteSlot}</div>}
    </div>
  );
}

const NEW_BRAND = "__neu__";

/** Marken-Auswahl: vorhandene Marken im Dropdown, neue Marke per Freitext – wird beim Speichern automatisch Teil der Liste. */
function BrandField({ brands, value, onChange, error }: { brands: string[]; value: string; onChange: (v: string) => void; error?: string }) {
  const known = value === "" || brands.includes(value);
  const [creating, setCreating] = useState(!known || brands.length === 0);
  if (creating) {
    return (
      <div className="flex gap-2">
        <input id="brand" name="brand" value={value} onChange={(e) => onChange(e.target.value)} required maxLength={80} placeholder="Name der neuen Marke" autoFocus={brands.length > 0} className={inputCls} {...describe("brand", error)} />
        {brands.length > 0 && (
          <button type="button" onClick={() => { setCreating(false); onChange(brands.includes(value) ? value : ""); }} className="inline-flex min-h-11 shrink-0 items-center rounded-xl border border-border px-3 text-sm font-semibold hover:bg-bg-soft">
            Aus Liste wählen
          </button>
        )}
      </div>
    );
  }
  return (
    <select
      id="brand"
      name="brand"
      value={value}
      required
      onChange={(e) => {
        if (e.target.value === NEW_BRAND) { setCreating(true); onChange(""); }
        else onChange(e.target.value);
      }}
      className={inputCls}
      {...describe("brand", error)}
    >
      <option value="" disabled>Marke wählen …</option>
      {brands.map((b) => <option key={b} value={b}>{b}</option>)}
      <option value={NEW_BRAND}>+ Neue Marke anlegen …</option>
    </select>
  );
}
