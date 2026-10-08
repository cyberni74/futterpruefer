"use client";
import { ActionForm, FieldError, type FormAction } from "./action-form";
import { SubmitButton } from "./submit-button";
import { describe, inputCls, labelCls, textareaCls } from "./ui";
import { MONTHS } from "@/lib/site";

export function PdmForm({
  action,
  reviews,
  defaultYear,
  defaultMonth,
}: {
  action: FormAction;
  reviews: { id: string; title: string; totalScore: number }[];
  defaultYear: number;
  defaultMonth: number;
}) {
  return (
    <ActionForm action={action} resetOnSuccess ariaLabel="Produkt des Monats festlegen">
      {({ pending, errors }) => (
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="pdm-month" className={labelCls}>
                Monat *
              </label>
              <select id="pdm-month" name="month" defaultValue={defaultMonth} className={inputCls} {...describe("pdm-month", errors.month)}>
                {MONTHS.map((m, i) => (
                  <option key={m} value={i + 1}>
                    {m}
                  </option>
                ))}
              </select>
              <FieldError id="pdm-month" error={errors.month} />
            </div>
            <div>
              <label htmlFor="pdm-year" className={labelCls}>
                Jahr *
              </label>
              <input id="pdm-year" name="year" type="number" min={2020} max={2100} defaultValue={defaultYear} className={inputCls} {...describe("pdm-year", errors.year)} />
              <FieldError id="pdm-year" error={errors.year} />
            </div>
          </div>
          <div>
            <label htmlFor="pdm-review" className={labelCls}>
              Test (veröffentlicht) *
            </label>
            <select id="pdm-review" name="reviewId" defaultValue="" className={inputCls} {...describe("pdm-review", errors.reviewId)}>
              <option value="">Bitte wählen …</option>
              {reviews.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.title} ({r.totalScore} Pkt.)
                </option>
              ))}
            </select>
            <FieldError id="pdm-review" error={errors.reviewId} />
          </div>
          <div>
            <label htmlFor="pdm-reason" className={labelCls}>
              Begründung *
            </label>
            <textarea id="pdm-reason" name="reason" rows={4} maxLength={1000} className={textareaCls} {...describe("pdm-reason", errors.reason)} />
            <FieldError id="pdm-reason" error={errors.reason} />
          </div>
          <p className="text-xs text-muted">Existiert für den Monat bereits ein Eintrag, wird er ersetzt.</p>
          <SubmitButton pending={pending}>Festlegen</SubmitButton>
        </div>
      )}
    </ActionForm>
  );
}
