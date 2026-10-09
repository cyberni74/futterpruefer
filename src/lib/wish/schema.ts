import { z } from "zod";

export const wishSchema = z.object({
  product: z.string().trim().min(2, "Bitte den Produktnamen angeben.").max(160, "Höchstens 160 Zeichen."),
  question: z.string().trim().max(1000, "Höchstens 1.000 Zeichen.").optional().transform((v) => v || undefined),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .max(200)
    .optional()
    .transform((v) => v || undefined)
    .refine((v) => v === undefined || z.string().email().safeParse(v).success, "Bitte eine gültige E-Mail-Adresse angeben oder das Feld leer lassen."),
  consent: z.literal("on", { message: "Bitte der Datenverarbeitung zustimmen." }),
});

export type WishState = { ok: boolean; message: string; errors?: Record<string, string>; values?: Record<string, string> };

export function parseWish(fd: FormData) {
  return wishSchema.safeParse({
    product: fd.get("product"),
    question: fd.get("question") ?? undefined,
    email: fd.get("email") ?? undefined,
    consent: fd.get("consent"),
  });
}
