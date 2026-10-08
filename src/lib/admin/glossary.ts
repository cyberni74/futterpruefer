import { z } from "zod";
import { slugify } from "@/lib/slug";
import { parseSynonyms } from "./lexikon";

export const glossarySchema = z.object({
  term: z.string().trim().min(2, "Bitte einen Begriff angeben.").max(120, "Höchstens 120 Zeichen."),
  slug: z.string().trim().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Nur Kleinbuchstaben, Ziffern und Bindestriche.").max(80),
  synonyms: z.array(z.string()).max(20),
  definition: z.string().trim().min(10, "Bitte mindestens 10 Zeichen.").max(600, "Höchstens 600 Zeichen."),
});

export function glossaryFormToRaw(fd: FormData) {
  const term = String(fd.get("term") ?? "");
  const slugIn = String(fd.get("slug") ?? "").trim();
  return {
    term,
    slug: slugIn || slugify(term),
    synonyms: parseSynonyms(String(fd.get("synonyms") ?? ""), term),
    definition: String(fd.get("definition") ?? ""),
  };
}
