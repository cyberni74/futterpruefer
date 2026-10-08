"use client";
import { ActionForm, FieldError, type FormAction } from "./action-form";
import { SubmitButton } from "./submit-button";
import { describe, inputCls, labelCls, textareaCls } from "./ui";

type Item = { id: string; term: string; slug: string; synonyms: string[]; definition: string };

export function GlossaryForm({ action, item }: { action: FormAction; item?: Item }) {
  const p = item?.id ?? "new";
  return (
    <ActionForm action={action} resetOnSuccess={!item} ariaLabel={item ? `Begriff bearbeiten: ${item.term}` : "Neuer Begriff"}>
      {({ pending, errors }) => (
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor={`${p}-t`} className={labelCls}>Begriff *</label>
              <input id={`${p}-t`} name="term" defaultValue={item?.term} maxLength={120} className={inputCls} {...describe(`${p}-t`, errors.term)} />
              <FieldError id={`${p}-t`} error={errors.term} />
            </div>
            <div>
              <label htmlFor={`${p}-s`} className={labelCls}>Slug (leer = automatisch)</label>
              <input id={`${p}-s`} name="slug" defaultValue={item?.slug} maxLength={80} className={`${inputCls} font-mono text-sm`} {...describe(`${p}-s`, errors.slug)} />
              <FieldError id={`${p}-s`} error={errors.slug} />
            </div>
          </div>
          <div>
            <label htmlFor={`${p}-y`} className={labelCls}>Synonyme (kommagetrennt)</label>
            <input id={`${p}-y`} name="synonyms" defaultValue={item?.synonyms.join(", ")} className={inputCls} />
          </div>
          <div>
            <label htmlFor={`${p}-d`} className={labelCls}>Definition *</label>
            <textarea id={`${p}-d`} name="definition" rows={3} maxLength={600} defaultValue={item?.definition} className={textareaCls} {...describe(`${p}-d`, errors.definition)} />
            <FieldError id={`${p}-d`} error={errors.definition} />
          </div>
          <SubmitButton pending={pending}>{item ? "Speichern" : "Begriff anlegen"}</SubmitButton>
        </div>
      )}
    </ActionForm>
  );
}
