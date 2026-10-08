"use client";
import { Link2, RefreshCw } from "lucide-react";
import { startTransition, useActionState, useRef, useState } from "react";
import { slugify } from "@/lib/slug";
import type { ActionResult } from "@/lib/admin/schemas";
import type { PublishMode } from "@/lib/admin/publish";
import { LEXIKON_GROUPS, SYNONYM_LEN, SYNONYM_MAX, type Concern, type LexikonEditorData } from "@/lib/admin/lexikon";
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
  const [shortDescription, setShortDescription] = useState(initial.shortDescription);
  const [assessment, setAssessment] = useState(initial.assessment);
  const [mode, setMode] = useState<PublishMode>(initial.publishMode);
  const [scheduledAt, setScheduledAt] = useState(initial.scheduledAt);
  const bodyRef = useRef(initial.bodyHtml);

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
            <RichEditor name="bodyHtml" id="bodyHtml" label="Ausführlicher Text" initialHtml={initial.bodyHtml} onChange={(h) => (bodyRef.current = h)} />
            {errors.bodyHtml && <p className="mt-1 text-sm font-medium text-bad">{errors.bodyHtml}</p>}
          </div>
        </Section>

        <Section title="SEO" id="sec-seo">
          <SeoPanel
            kind="lexikon"
            slug={slug}
            fallbackTitle={name}
            fallbackDescription={shortDescription}
            initial={{ metaTitle: initial.metaTitle, metaDescription: initial.metaDescription, keywords: [] }}
            errors={errors}
            showKeywords={false}
            getContext={() => ({ title: name, keyword: group, excerpt: shortDescription, verdict: assessment, body: stripTags(bodyRef.current) })}
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
