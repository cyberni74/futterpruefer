import { AUTHORS, DEFAULT_AUTHOR } from "@/lib/authors";
import { Field, describe, inputCls } from "./ui";

/** Optionales Autorenfeld. Leer lassen ordnet den Standardautor zu. */
export function AuthorField({ value, error }: { value: string; error?: string }) {
  return (
    <Field
      id="authorSlug"
      label="Autor"
      error={error}
      hint={`Optional. Ohne Auswahl gilt ${DEFAULT_AUTHOR.name}. Es stehen nur Personen zur Wahl, die auf der Website genannt sind.`}
    >
      <select id="authorSlug" name="authorSlug" defaultValue={value} className={inputCls} {...describe("authorSlug", error, true)}>
        <option value="">Standard ({DEFAULT_AUTHOR.name})</option>
        {AUTHORS.map((a) => (
          <option key={a.slug} value={a.slug}>
            {a.name}
          </option>
        ))}
      </select>
    </Field>
  );
}
