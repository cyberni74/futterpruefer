"use client";
import { Link2, RefreshCw } from "lucide-react";
import { startTransition, useActionState, useRef, useState } from "react";
import { slugify } from "@/lib/slug";
import type { ActionResult } from "@/lib/admin/schemas";
import type { PublishMode } from "@/lib/admin/publish";
import { stripTags } from "@/lib/admin/text";
import { EditorHeader, SaveBar, useFocusFirstError } from "./editor-shell";
import { ImageField } from "./image-field";
import { PublishField } from "./publish-field";
import { RichEditor } from "./rich-editor";
import { SeoPanel } from "./seo-panel";
import { Field, Section, describe, inputCls, textareaCls } from "./ui";

export type BlogEditorData = {
  id?: string;
  title: string;
  slug: string;
  excerpt: string;
  bodyHtml: string;
  imageUrl: string | null;
  imageAlt: string;
  imageBlur: string | null;
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  publishMode: PublishMode;
  scheduledAt: string;
};

const FORM_ID = "blog-form";

export function BlogEditor({
  initial,
  action,
  badge,
  deleteSlot,
  justCreated,
}: {
  initial: BlogEditorData;
  action: (prev: ActionResult | null, fd: FormData) => Promise<ActionResult>;
  badge?: React.ReactNode;
  deleteSlot?: React.ReactNode;
  justCreated?: boolean;
}) {
  const isNew = !initial.id;
  const [state, formAction, pending] = useActionState(action, justCreated ? { ok: true, message: "Artikel angelegt und gespeichert.", at: 0 } : null);
  const formRef = useFocusFirstError(state);
  const errors = state?.fieldErrors ?? {};

  const [title, setTitle] = useState(initial.title);
  const [slug, setSlug] = useState(initial.slug);
  const [slugTouched, setSlugTouched] = useState(!isNew);
  const [excerpt, setExcerpt] = useState(initial.excerpt);
  const [mode, setMode] = useState<PublishMode>(initial.publishMode);
  const [scheduledAt, setScheduledAt] = useState(initial.scheduledAt);
  const bodyRef = useRef(initial.bodyHtml);

  return (
    <div className="mx-auto max-w-4xl">
      <EditorHeader
        formId={FORM_ID}
        backHref="/admin/blog"
        backLabel="Alle Artikel"
        title={isNew ? "Neuer Artikel" : title || "Artikel bearbeiten"}
        badge={badge}
        previewHref={initial.id ? `/admin/vorschau/blog/${initial.id}` : undefined}
        pending={pending}
      />
      <form id={FORM_ID} ref={formRef} className="min-w-0 space-y-6"
        noValidate
        onSubmit={(e) => {
          // Kein natives Formular-Reset nach der Action (würde kontrollierte Felder desynchronisieren)
          e.preventDefault();
          const fd = new FormData(e.currentTarget);
          startTransition(() => formAction(fd));
        }}
      >
        <Section title="Artikel" id="sec-artikel">
          <Field id="title" label="Titel *" error={errors.title}>
            <input
              id="title"
              name="title"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (!slugTouched) setSlug(slugify(e.target.value));
              }}
              maxLength={160}
              required
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
                <span className="font-semibold break-all text-mid">Neue URL – /blog/{initial.slug} wird automatisch weitergeleitet.</span>
              ) : (
                <span className="break-all">futterpruefer.de/blog/{slug || "…"}</span>
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
                  setSlug(slugify(title));
                  setSlugTouched(!isNew);
                }}
                className="inline-flex size-11 shrink-0 items-center justify-center rounded-xl border border-border hover:bg-bg-soft"
                aria-label="Slug aus Titel neu erzeugen"
                title="Slug aus Titel neu erzeugen"
              >
                <RefreshCw className="size-4" aria-hidden />
              </button>
            </div>
          </Field>
          <Field id="excerpt" label="Anreißer" error={errors.excerpt} hint={`${excerpt.length}/400 Zeichen – erscheint in Übersichten und Teasern.`}>
            <textarea id="excerpt" name="excerpt" value={excerpt} onChange={(e) => setExcerpt(e.target.value)} rows={3} maxLength={400} className={textareaCls} {...describe("excerpt", errors.excerpt, true)} />
          </Field>
        </Section>

        <Section title="Titelbild" id="sec-bild">
          <ImageField kind="blog" nameSource={title} initialUrl={initial.imageUrl} initialAlt={initial.imageAlt} initialBlur={initial.imageBlur} errors={errors} />
        </Section>

        <Section title="Text" id="sec-text">
          <RichEditor name="bodyHtml" id="bodyHtml" label="Artikeltext" initialHtml={initial.bodyHtml} onChange={(h) => (bodyRef.current = h)} />
          {errors.bodyHtml && <p className="text-sm font-medium text-bad">{errors.bodyHtml}</p>}
        </Section>

        <Section title="SEO" id="sec-seo">
          <SeoPanel
            kind="blog"
            slug={slug}
            fallbackTitle={title}
            fallbackDescription={excerpt}
            initial={{ metaTitle: initial.metaTitle, metaDescription: initial.metaDescription, keywords: initial.keywords }}
            errors={errors}
            getContext={() => ({ title, excerpt, body: stripTags(bodyRef.current) })}
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
