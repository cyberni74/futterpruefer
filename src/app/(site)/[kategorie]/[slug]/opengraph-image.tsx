import { ImageResponse } from "next/og";
import sharp from "sharp";
import { productLabel } from "@/lib/seo";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { getReviewBySlug } from "@/lib/queries";
import { ratingFor } from "@/lib/scoring";
import { LOGO_ROUND_DATA_URL } from "@/lib/logo-data";

export const alt = "Testergebnis";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const COLOR = { gut: "#16a34a", mittel: "#eab308", schlecht: "#dc2626" } as const;

/** Produktbild als PNG-Data-URL (Satori kann kein WebP). Lokale Bilder aus /public, externe per fetch. */
async function productImage(src: string | null | undefined): Promise<string | null> {
  if (!src) return null;
  try {
    const buf = src.startsWith("http")
      ? Buffer.from(await (await fetch(src)).arrayBuffer())
      : await readFile(path.join(process.cwd(), "public", src.replace(/^\/+/, "")));
    const png = await sharp(buf).resize(440, 440, { fit: "cover" }).png().toBuffer();
    return `data:image/png;base64,${png.toString("base64")}`;
  } catch {
    return null;
  }
}

export default async function OgImage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const r = await getReviewBySlug(slug);
  const score = r?.totalScore ?? 0;
  const color = COLOR[ratingFor(score)];
  const img = await productImage(r?.imageUrl);
  const c = 2 * Math.PI * 70;
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", background: "#f4f8f7", fontFamily: "sans-serif" }}>
        <div style={{ width: 520, height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#e2f0ee" }}>
          {img ? <img src={img} width={440} height={440} style={{ borderRadius: 36 }} alt="" /> : <img src={LOGO_ROUND_DATA_URL} width={320} height={320} alt="" />}
        </div>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", padding: 56, gap: 18 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <img src={LOGO_ROUND_DATA_URL} width={56} height={56} alt="" />
            <div style={{ display: "flex", fontSize: 28, fontWeight: 700, color: "#0a5654" }}>Futterprüfer.de · Fachtest</div>
          </div>
          <div style={{ display: "flex", fontSize: 54, fontWeight: 800, color: "#12201f", lineHeight: 1.1 }}>{r ? productLabel(r.brand, r.productName) : "Futtertest"}</div>
          <div style={{ display: "flex", alignItems: "center", gap: 24, marginTop: 8 }}>
            <div style={{ position: "relative", width: 170, height: 170, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="170" height="170" viewBox="0 0 170 170" style={{ position: "absolute", top: 0, left: 0, transform: "rotate(-90deg)" }}>
                <circle cx="85" cy="85" r="70" fill="#ffffff" stroke="#dde7e5" strokeWidth="16" />
                <circle cx="85" cy="85" r="70" fill="none" stroke={color} strokeWidth="16" strokeLinecap="round" strokeDasharray={`${(score / 100) * c} ${c}`} />
              </svg>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <div style={{ display: "flex", fontSize: 60, fontWeight: 800, color: "#12201f" }}>{score}</div>
                <div style={{ display: "flex", fontSize: 20, color: "#4b5f5d" }}>von 100</div>
              </div>
            </div>
            <div style={{ display: "flex", fontSize: 28, color: "#4b5f5d", maxWidth: 380 }}>{r?.category.name ?? ""}</div>
          </div>
        </div>
      </div>
    ),
    size,
  );
}
