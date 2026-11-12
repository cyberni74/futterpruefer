"use client";
import { Link2, RefreshCw } from "lucide-react";
import { startTransition, useActionState, useRef, useState } from "react";
import { slugify } from "@/lib/slug";
import type { ActionResult } from "@/lib/admin/schemas";
import type { PublishMode } from "@/lib/admin/publish";
import { CONCERN_LABEL, LEXIKON_FAQ_MAX, LEXIKON_GROUPS, LEXIKON_IMAGE_SLOTS, SYNONYM_LEN, SYNONYM_MAX, type Concern, type LexikonEditorData, type LexikonFaqInput, type LexikonImageInput } from "@/lib/admin/lexikon";
import { seoTitle } from "@/lib/seo";
import { stripTags } from "@/lib/admin/text";
import { ConcernField } from "./concern-field";
import { EditorHeader, SaveBar, useFocusFirstError } from "./editor-shell";
import { ListInput } from "./list-input";
import { PublishField } from "./publish-field";
import { RichEditor } from "./rich-editor";
import { SeoPanel } from "./seo-panel";
import { Field, Section, describe, inputCls, textareaCls } from "./ui";

const FORM_ID = "lexikon-form";

export function LexikonEditor({
  initial,
  action,
  badge,
  deleteSlot,
  justCreated,
}: {
  initial: LexikonEditorData;
  action: (prev: ActionResult | null, fd: FormData) => Promise<ActionResult>;
  badge?: React.ReactNode;
  deleteSlot?: React.ReactNode;
  justCreated?: boolean;
}) {
  const isNew = !initial.id;
  const [state, formAction, pending] = useActionState(action, justCreated ? { ok: true, message: "Eintrag angelegt und gespeichert.", at: 0 } : null);
  const formRef = useFocusFirstError(state);
  const errors = state?.fieldErrors ?? {};

  const [name, setName] = useState(initial.name);
  const [slug, setSlug] = useState(initial.slug);
  const [slugTouched, setSlugTouched] = useState(!isNew);
  const [synonyms, setSynonyms] = useState<string[]>(initial.synonyms);
  const [group, setGroup] = useState(initial.group);
  const [concern, setConcern] = useState<Concern>(initial.concern);
  const [headline, setHeadline] = useState(initial.headline);
  const [shortDescription, setShortDescription] = useState(initial.shortDescription);
  const [assessment, setAssessment] = useState(initial.assessment);
  const [images, setImages] = useState<LexikonImageInput[]>(initial.images);
  const [faqs, setFaqs] = useState<LexikonFaqInput[]>(initial.faqs);
  const [mode, setMode] = useState<PublishMode>(initial.publishMode);
  const [scheduledAt, setScheduledAt] = useState(initial.scheduledAt);
  const bodyRef = useRef(initial.bodyHtml);
  const complexBody = /<(?:table|figure|figcaption|div)\b/i.test(initial.bodyHtml);
  const autoTitle = `${name || "Begriff"} im Tierfutter: ${CONCERN_LABEL[concern]}?`;

  function setImage(index: number, patch: Partial<LexikonImageInput>) {
    setImages((prev) => prev.map((image, i) => (i === index ? { ...image, ...patch } : image)));
  }

  return (
    <div className="mx-auto max-w-4xl">
      <EditorHeader
        formId={FORM_ID}
        backHref="/admin/lexikon"
        backLabel="Alle Lexikon-Einträge"
        title={isNew ? "Neuer Lexikon-Eintrag" : name || "Eintrag bearbeiten"}
        badge={badge}
        previewHref={initial.isLive ? `/lexikon/${initial.slug}` : undefined}
        previewLabel="Live ansehen"
        previewHint={isNew ? "Live-Ansicht nach dem Veröffentlichen verfügbar" : "Noch nicht öffentlich"}
        pending={pending}
      />
      <form
        id={FORM_ID}
        ref={formRef}
        className="min-w-0 space-y-6"
        noValidate
        onSubmit={(e) => {
          // Kein natives Formular-Reset nach der Action (würde kontrollierte Felder desynchronisieren)
          e.preventDefault();
          const fd = new FormData(e.currentTarget);
          startTransition(() => formAction(fd));
        }}
      >
        <Section title="Inhaltsstoff" id="sec-stoff">
          <Field id="name" label="Name *" error={errors.name}>
            <input
              id="name"
              name="name"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (!slugTouched) setSlug(slugify(e.target.value));
              }}
              maxLength={120}
              required
              className={inputCls}
              {...describe("name", errors.name)}
            />
          </Field>
          <Field
            id="slug"
            label="Slug (URL)"
            error={errors.slug}
            hint={
              !isNew && slug !== initial.slug ? (
                <span className="font-semibold break-all text-mid">Neue URL – /lexikon/{initial.slug} wird automatisch weitergeleitet.</span>
              ) : (
                <span className="break-all">futterpruefer.de/lexikon/{slug || "…"}</span>
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
                  maxLength={80}
                  required
                  className={`${inputCls} pl-9 font-mono text-sm`}
                  {...describe("slug", errors.slug, true)}
                />
              </div>
              <button
                type="button"
                onClick={() => {
                  setSlug(slugify(name));
                  setSlugTouched(!isNew);
                }}
                className="inline-flex size-11 shrink-0 items-center justify-center rounded-xl border border-border hover:bg-bg-soft"
                aria-label="Slug aus Name neu erzeugen"
                title="Slug aus Name neu erzeugen"
              >
                <RefreshCw className="size-4" aria-hidden />
              </button>
            </div>
          </Field>
          <ListInput
            name="synonyms"
            label="Synonyme"
            itemLabel="Synonym"
            hint="Alternative Schreibweisen – werden in Tests und Blogartikeln ebenfalls automatisch verlinkt (z. B. „Taurine“)."
            items={synonyms}
            onChange={setSynonyms}
            max={SYNONYM_MAX}
            maxLength={SYNONYM_LEN}
            error={errors.synonyms}
            tone="neutral"
          />
          <Field id="group" label="Gruppe" error={errors.group} hint="Freitext – Vorschläge per Auswahlliste.">
            <input
              id="group"
              name="group"
              list="lexikon-groups"
              value={group}
              onChange={(e) => setGroup(e.target.value)}
              maxLength={60}
              autoComplete="off"
              placeholder="z. B. Zusatzstoff"
              className={inputCls}
              {...describe("group", errors.group, true)}
            />
            <datalist id="lexikon-groups">
              {LEXIKON_GROUPS.map((g) => (
                <option key={g} value={g} />
              ))}
            </datalist>
          </Field>
          <ConcernField value={concern} onChange={setConcern} error={errors.concern} />
        </Section>

        <Section title="Beschreibung" id="sec-text">
          <Field
            id="headline"
            label="Überschrift (H1)"
            error={errors.headline}
            hint={`${headline.length}/160 Zeichen. Leer = der Begriff „${name || "…"}“ bleibt die H1.`}
          >
            <input
              id="headline"
              name="headline"
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              maxLength={160}
              placeholder="z. B. Tierische Nebenerzeugnisse im Hunde- und Katzenfutter"
              className={inputCls}
              {...describe("headline", errors.headline, true)}
            />
          </Field>
          <Field
            id="shortDescription"
            label="Kurzbeschreibung"
            error={errors.shortDescription}
            hint={`${shortDescription.length}/300 Zeichen – 1–2 Sätze, erscheint in der Übersicht und in Tooltips.`}
          >
            <textarea
              id="shortDescription"
              name="shortDescription"
              value={shortDescription}
              onChange={(e) => setShortDescription(e.target.value)}
              rows={3}
              maxLength={300}
              className={textareaCls}
              {...describe("shortDescription", errors.shortDescription, true)}
            />
          </Field>
          <Field id="assessment" label="Bewertung / Einschätzung" error={errors.assessment} hint={`${assessment.length}/1000 Zeichen – unsere Einordnung der Ampel-Stufe.`}>
            <textarea
              id="assessment"
              name="assessment"
              value={assessment}
              onChange={(e) => setAssessment(e.target.value)}
              rows={5}
              maxLength={1000}
              className={textareaCls}
              {...describe("assessment", errors.assessment, true)}
            />
          </Field>
          <div>
            <p className="mb-1.5 block text-sm font-semibold text-fg">Ausführlicher Text</p>
            <p className="mb-2 text-xs text-muted">
              Leer lassen, dann bleibt die fachliche Einschätzung der Seitentext. Lange Artikel mit Tabellen, Abbildungen, FAQ und Quellen im HTML-Modus einfügen und so speichern. Der visuelle Modus kennt diese Bausteine nicht.
            </p>
            <RichEditor name="bodyHtml" id="bodyHtml" label="Ausführlicher Text" initialHtml={initial.bodyHtml} initialSource={complexBody} lockComplexHtml onChange={(h) => (bodyRef.current = h)} />
            {errors.bodyHtml && <p className="mt-1 text-sm font-medium text-bad">{errors.bodyHtml}</p>}
          </div>
        </Section>

        <Section
          title="Bilder"
          id="sec-bilder"
          description="Bis zu fünf Bilder. Das erste mit URL ist das Titelbild für Vorschau und Open Graph. Steht dieselbe URL schon im Artikeltext, wird sie dort nicht noch einmal ausgegeben. Leere Felder bleiben unsichtbar."
        >
          {images.slice(0, LEXIKON_IMAGE_SLOTS).map((image, i) => (
            <fieldset key={i} className="space-y-3 rounded-xl border border-border p-3">
              <legend className="px-1 text-sm font-semibold">{i === 0 ? "Bild 1 · Titelbild" : `Bild ${i + 1}`}</legend>
              <Field id={`image-url-${i}`} label="URL" error={errors[`imageUrl${i}`]} hint="Öffentlicher Bucket „bilder“ oder ein bestehender Pfad wie /uploads/…">
                <input
                  id={`image-url-${i}`}
                  name="imageUrl"
                  value={image.url}
                  onChange={(e) => setImage(i, { url: e.target.value })}
                  maxLength={500}
                  inputMode="url"
                  placeholder="https://…/storage/v1/object/public/bilder/datei.webp"
                  className={inputCls}
                  {...describe(`image-url-${i}`, errors[`imageUrl${i}`], true)}
                />
              </Field>
              <Field id={`image-alt-${i}`} label="Alt-Text" error={errors[`imageAlt${i}`]} hint="Pflicht, sobald eine URL gesetzt ist. Üblich: „Symbolbild: …“">
                <input
                  id={`image-alt-${i}`}
                  name="imageAlt"
                  value={image.alt}
                  onChange={(e) => setImage(i, { alt: e.target.value })}
                  maxLength={300}
                  className={inputCls}
                  {...describe(`image-alt-${i}`, errors[`imageAlt${i}`], true)}
                />
              </Field>
              <Field id={`image-caption-${i}`} label="Bildunterschrift und Credit" error={errors[`imageCaption${i}`]}>
                <textarea
                  id={`image-caption-${i}`}
                  name="imageCaption"
                  value={image.caption}
                  onChange={(e) => setImage(i, { caption: e.target.value })}
                  maxLength={400}
                  rows={2}
                  className={textareaCls}
                  {...describe(`image-caption-${i}`, errors[`imageCaption${i}`])}
                />
              </Field>
            </fieldset>
          ))}
        </Section>

        <Section
          title="Häufige Fragen"
          id="sec-faq"
          description="Frage und Antwort, wie sie auf der Seite stehen. Enthält der Artikeltext schon einen Abschnitt „Häufige Fragen“, gilt dessen Wortlaut für Besucher und das FAQ-Markup. Diese Paare erscheinen nur, wenn der Text keinen solchen Abschnitt hat."
        >
          {faqs.map((item, i) => (
            <fieldset key={i} className="space-y-3 rounded-xl border border-border p-3">
              <legend className="px-1 text-sm font-semibold">Frage {i + 1}</legend>
              <Field id={`faq-q-${i}`} label="Frage" error={errors[`faqQuestion${i}`]}>
                <input
                  id={`faq-q-${i}`}
                  name="faqQuestion"
                  value={item.question}
                  onChange={(e) => setFaqs((prev) => prev.map((faq, n) => (n === i ? { ...faq, question: e.target.value } : faq)))}
                  maxLength={300}
                  className={inputCls}
                  {...describe(`faq-q-${i}`, errors[`faqQuestion${i}`])}
                />
              </Field>
              <Field id={`faq-a-${i}`} label="Antwort" error={errors[`faqAnswer${i}`]}>
                <textarea
                  id={`faq-a-${i}`}
                  name="faqAnswer"
                  value={item.answer}
                  onChange={(e) => setFaqs((prev) => prev.map((faq, n) => (n === i ? { ...faq, answer: e.target.value } : faq)))}
                  maxLength={2000}
                  rows={4}
                  className={textareaCls}
                  {...describe(`faq-a-${i}`, errors[`faqAnswer${i}`])}
                />
              </Field>
              <button
                type="button"
                className="inline-flex min-h-11 items-center text-sm font-semibold text-bad"
                onClick={() => setFaqs((prev) => prev.filter((_, n) => n !== i))}
              >
                Frage entfernen
              </button>
            </fieldset>
          ))}
          <button
            type="button"
            className="inline-flex min-h-11 items-center rounded-xl border border-border px-4 text-sm font-semibold hover:bg-bg-soft disabled:opacity-50"
            disabled={faqs.length >= LEXIKON_FAQ_MAX}
            onClick={() => setFaqs((prev) => [...prev, { question: "", answer: "" }])}
          >
            Frage hinzufügen
          </button>
        </Section>

        <Section title="SEO" id="sec-seo">
          <SeoPanel
            kind="lexikon"
            slug={slug}
            fallbackTitle={autoTitle}
            fallbackDescription={shortDescription}
            emptyTitle={seoTitle(autoTitle)}
            titleLabel="SEO-Titel"
            titleHint={`Leer = „${autoTitle}“. Die Marke wird angehängt, wenn der Titel sonst unter 60 Zeichen bleibt.`}
            initial={{ metaTitle: initial.metaTitle, metaDescription: initial.metaDescription, keywords: [] }}
            errors={errors}
            showKeywords={false}
            getContext={() => ({ title: headline || name, keyword: group, excerpt: shortDescription, verdict: assessment, body: stripTags(bodyRef.current) })}
          />
        </Section>

        <Section title="Veröffentlichung" id="sec-status">
          <PublishField mode={mode} onModeChange={setMode} scheduledAt={scheduledAt} onScheduledAtChange={setScheduledAt} error={errors.scheduledAt} />
        </Section>

        <SaveBar pending={pending} state={state} />
      </form>
      {deleteSlot && <div className="mt-10 border-t border-border pt-6">{deleteSlot}</div>}
    </div>
  );
}
