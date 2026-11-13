import { AUTHORS, DEFAULT_AUTHOR } from "@/lib/authors";
import { Field, describe, inputCls } from "./ui";

/** Optionales Autorenfeld. Leer lassen ordnet den Standardautor zu. */
export function AuthorField({ value, error }: { value: string; error?: string }) {
  return (
    <Field
      id="authorSlug"
      label="Autor"
      error={error}
      hint={`Optional. Ohne Auswahl gilt ${DEFAULT_AUTHOR.name}.`}
    >
      <select id="authorSlug" name="authorSlug" defaultValue={value === "matthias-schroeter" ? value : ""} className={inputCls} {...describe("authorSlug", error, true)}>
        <option value="">Standard ({DEFAULT_AUTHOR.name})</option>
        {AUTHORS.filter((author) => author.kind === "person").map((author) => (
          <option key={author.slug} value={author.slug}>
            {author.name}
          </option>
        ))}
      </select>
    </Field>
  );
}
