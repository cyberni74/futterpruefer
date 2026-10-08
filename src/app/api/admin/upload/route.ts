import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import { put } from "@vercel/blob";
import { auth } from "@/auth";
import { MAX_IMAGE_WIDTH, MAX_UPLOAD_BYTES, altSuggestion, buildImageFileName, isAllowedSharpFormat } from "@/lib/admin/upload";

export const dynamic = "force-dynamic";

function error(message: string, status: number) {
  return Response.json({ error: message }, { status });
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) return error("Nicht angemeldet.", 401);

  const len = Number(request.headers.get("content-length") ?? 0);
  if (len > MAX_UPLOAD_BYTES + 64 * 1024) return error("Die Datei ist größer als 8 MB.", 413);

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return error("Ungültige Anfrage.", 400);
  }
  const file = form.get("file");
  const name = String(form.get("name") ?? "").slice(0, 200);
  const kind = form.get("kind") === "blog" ? "blog" : "review";
  if (!(file instanceof File) || file.size === 0) return error("Keine Datei erhalten.", 400);
  if (file.size > MAX_UPLOAD_BYTES) return error("Die Datei ist größer als 8 MB.", 413);

  const input = Buffer.from(await file.arrayBuffer());
  let meta: Awaited<ReturnType<ReturnType<typeof sharp>["metadata"]>>;
  try {
    meta = await sharp(input).metadata();
  } catch {
    return error("Die Datei ist kein gültiges Bild.", 415);
  }
  if (!isAllowedSharpFormat(meta.format, meta.compression)) return error("Nur JPEG, PNG, WebP oder AVIF erlaubt.", 415);

  let output: Buffer;
  let blurBuf: Buffer;
  try {
    output = await sharp(input).rotate().resize({ width: MAX_IMAGE_WIDTH, withoutEnlargement: true }).webp({ quality: 80 }).toBuffer();
    blurBuf = await sharp(input).rotate().resize(16, 16, { fit: "inside" }).webp({ quality: 40 }).toBuffer();
  } catch (e) {
    console.error("upload: sharp", e);
    return error("Das Bild konnte nicht verarbeitet werden.", 422);
  }
  const blur = `data:image/webp;base64,${blurBuf.toString("base64")}`;
  const fileName = buildImageFileName(name);

  let url: string;
  try {
    if (process.env.BLOB_READ_WRITE_TOKEN) {
      const res = await put(`bilder/${fileName}`, output, { access: "public", contentType: "image/webp", addRandomSuffix: false });
      url = res.url;
    } else {
      const dir = path.join(process.cwd(), "public", "uploads");
      await mkdir(dir, { recursive: true });
      await writeFile(path.join(dir, fileName), output);
      url = `/uploads/${fileName}`;
    }
  } catch (e) {
    console.error("upload: storage", e);
    return error("Speichern des Bildes fehlgeschlagen.", 500);
  }

  return Response.json({ url, blur, altSuggestion: altSuggestion(kind, name) });
}
