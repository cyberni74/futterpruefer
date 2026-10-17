"use client";
import { useActionState } from "react";
import type { ActionResult } from "@/lib/admin/schemas";
import { Field, Section, describe, inputCls, textareaCls } from "./ui";
import { SaveBar } from "./editor-shell";

type Item = {
  wirkstoff: string;
  tierart: "HUND" | "KATZE";
  mgProKgMin: string;
  mgProKgMax: string;
  einheit: string;
  quelle: string;
  luecke: boolean;
  hinweis: string;
  stand: string;
};

export function ReferenzForm({ action, item }: { action: (prev: ActionResult | null, fd: FormData) => Promise<ActionResult>; item?: Item }) {
  const [state, formAction, pending] = useActionState(action, null);
  const errors = state?.fieldErrors ?? {};
  return (
    <form action={formAction} className="space-y-4">
      {!item && <Section title="Neue Referenzdosis" id="ref-neu"><ReferenzInputs errors={errors} /></Section>}
      {item && <ReferenzInputs item={item} errors={errors} />}
      <SaveBar pending={pending} state={state} />
    </form>
  );
}

function ReferenzInputs({ item, errors }: { item?: Item; errors: Record<string, string | undefined> }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <Field id={item ? `wirkstoff-${item.wirkstoff}` : "wirkstoff"} label="Wirkstoff *" error={errors.wirkstoff}>
        <input id={item ? `wirkstoff-${item.wirkstoff}` : "wirkstoff"} name="wirkstoff" defaultValue={item?.wirkstoff ?? ""} required className={inputCls} {...describe("wirkstoff", errors.wirkstoff)} />
      </Field>
      <Field id={item ? `tierart-${item.wirkstoff}` : "tierart"} label="Tierart *" error={errors.tierart}>
        <select id={item ? `tierart-${item.wirkstoff}` : "tierart"} name="tierart" defaultValue={item?.tierart ?? "HUND"} className={inputCls}>
          <option value="HUND">Hund</option>
          <option value="KATZE">Katze</option>
        </select>
      </Field>
      <Field id="mgProKgMin" label="mg/kg mindestens" error={errors.mgProKgMin}>
        <input name="mgProKgMin" defaultValue={item?.mgProKgMin ?? ""} inputMode="decimal" className={inputCls} />
      </Field>
      <Field id="mgProKgMax" label="mg/kg höchstens" error={errors.mgProKgMax}>
        <input name="mgProKgMax" defaultValue={item?.mgProKgMax ?? ""} inputMode="decimal" className={inputCls} />
      </Field>
      <Field id="einheit" label="Einheit *" error={errors.einheit}>
        <input name="einheit" defaultValue={item?.einheit ?? "mg/kg"} required className={inputCls} />
      </Field>
      <Field id="stand" label="Stand *" error={errors.stand}>
        <input name="stand" type="date" defaultValue={item?.stand ?? "2026-10-17"} required className={inputCls} />
      </Field>
      <Field id="quelle" label="Quelle" error={errors.quelle} className="sm:col-span-2">
        <input name="quelle" defaultValue={item?.quelle ?? ""} className={inputCls} />
      </Field>
      <label className="flex min-h-11 items-center gap-3 text-sm font-semibold sm:col-span-2">
        <input type="checkbox" name="luecke" defaultChecked={item?.luecke ?? false} />
        Lücke: keine belastbare Dosis
      </label>
      <Field id="hinweis" label="Hinweis" error={errors.hinweis} className="sm:col-span-2">
        <textarea name="hinweis" defaultValue={item?.hinweis ?? ""} rows={3} className={textareaCls} />
      </Field>
    </div>
  );
}
