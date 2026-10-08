"use client";
import { ActionForm, FieldError, type FormAction } from "./action-form";
import { SubmitButton } from "./submit-button";
import { describe, inputCls, labelCls, textareaCls } from "./ui";

export function FaqForm({ action, item, nextSort = 0 }: { action: FormAction; item?: { id: string; question: string; answer: string; sortOrder: number }; nextSort?: number }) {
  const p = item?.id ?? "new";
  return (
    <ActionForm action={action} resetOnSuccess={!item} ariaLabel={item ? `Frage bearbeiten: ${item.question}` : "Neue Frage"}>
      {({ pending, errors }) => (
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-[1fr_8rem]">
            <div>
              <label htmlFor={`${p}-q`} className={labelCls}>
                Frage *
              </label>
              <input id={`${p}-q`} name="question" defaultValue={item?.question} maxLength={300} className={inputCls} {...describe(`${p}-q`, errors.question)} />
              <FieldError id={`${p}-q`} error={errors.question} />
            </div>
            <div>
              <label htmlFor={`${p}-s`} className={labelCls}>
                Sortierung
              </label>
              <input id={`${p}-s`} name="sortOrder" type="number" step={1} defaultValue={item?.sortOrder ?? nextSort} className={inputCls} {...describe(`${p}-s`, errors.sortOrder)} />
              <FieldError id={`${p}-s`} error={errors.sortOrder} />
            </div>
          </div>
          <div>
            <label htmlFor={`${p}-a`} className={labelCls}>
              Antwort *
            </label>
            <textarea id={`${p}-a`} name="answer" rows={4} defaultValue={item?.answer} maxLength={4000} className={textareaCls} {...describe(`${p}-a`, errors.answer)} />
            <FieldError id={`${p}-a`} error={errors.answer} />
          </div>
          <SubmitButton pending={pending}>{item ? "Speichern" : "Frage anlegen"}</SubmitButton>
        </div>
      )}
    </ActionForm>
  );
}
