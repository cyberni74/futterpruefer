"use client";
import { ActionForm, FieldError, type FormAction } from "./action-form";
import { SubmitButton } from "./submit-button";
import { describe, inputCls, labelCls } from "./ui";
import { dateToBerlinLocal } from "@/lib/admin/datetime";

export type TickerItemData = { id: string; text: string; href: string | null; isWarning: boolean; active: boolean; expiresAt: Date | string | null };

export function TickerForm({ action, item }: { action: FormAction; item?: TickerItemData }) {
  const p = item?.id ?? "new";
  const f = (n: string) => `${p}-${n}`;
  return (
    <ActionForm action={action} resetOnSuccess={!item} ariaLabel={item ? `Meldung bearbeiten: ${item.text}` : "Neue Ticker-Meldung"}>
      {({ pending, errors }) => (
        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="md:col-span-2">
              <label htmlFor={f("text")} className={labelCls}>
                Text *
              </label>
              <input id={f("text")} name="text" defaultValue={item?.text} maxLength={200} required className={inputCls} {...describe(f("text"), errors.text)} />
              <FieldError id={f("text")} error={errors.text} />
            </div>
            <div>
              <label htmlFor={f("href")} className={labelCls}>
                Link (optional)
              </label>
              <input
                id={f("href")}
                name="href"
                defaultValue={item?.href ?? ""}
                placeholder="/tests/… oder https://…"
                maxLength={500}
                className={inputCls}
                {...describe(f("href"), errors.href)}
              />
              <FieldError id={f("href")} error={errors.href} />
            </div>
            <div>
              <label htmlFor={f("exp")} className={labelCls}>
                Ablaufdatum (optional, Berliner Zeit)
              </label>
              <input
                id={f("exp")}
                name="expiresAt"
                type="datetime-local"
                defaultValue={dateToBerlinLocal(item?.expiresAt)}
                className={inputCls}
                {...describe(f("exp"), errors.expiresAt)}
              />
              <FieldError id={f("exp")} error={errors.expiresAt} />
            </div>
            <div className="flex flex-wrap gap-x-6 gap-y-2 md:col-span-2">
              <label className="inline-flex min-h-11 items-center gap-2.5 text-sm font-semibold">
                <input type="checkbox" name="isWarning" defaultChecked={item?.isWarning ?? false} className="size-5 accent-[var(--bad)]" />
                Warnung (rot hervorheben)
              </label>
              <label className="inline-flex min-h-11 items-center gap-2.5 text-sm font-semibold">
                <input type="checkbox" name="active" defaultChecked={item?.active ?? true} className="size-5 accent-[var(--brand)]" />
                Aktiv
              </label>
            </div>
          </div>
          <SubmitButton pending={pending}>{item ? "Speichern" : "Meldung anlegen"}</SubmitButton>
        </div>
      )}
    </ActionForm>
  );
}
