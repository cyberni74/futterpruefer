import { ImageResponse } from "next/og";
import { getReviewBySlug } from "@/lib/queries";
import { ratingFor } from "@/lib/scoring";
import { LOGO_ROUND_DATA_URL } from "@/lib/logo-data";

export const alt = "Testergebnis";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const COLOR = { gut: "#15803d", mittel: "#a16207", schlecht: "#b91c1c" } as const;

export default async function OgImage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const r = await getReviewBySlug(slug);
  const score = r?.totalScore ?? 0;
  const color = COLOR[ratingFor(score)];
  const img = r?.imageUrl?.startsWith("https://") ? r.imageUrl : null;
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", background: "#f4f8f7", fontFamily: "sans-serif" }}>
        <div style={{ width: 480, height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#e2f0ee" }}>
          {img ? <img src={img} width={420} height={420} style={{ objectFit: "cover", borderRadius: 32 }} alt="" /> : <img src={LOGO_ROUND_DATA_URL} width={320} height={320} alt="" />}
        </div>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", padding: 56, gap: 20 }}>
          <div style={{ display: "flex", fontSize: 28, fontWeight: 700, color: "#0a5654" }}>Futterprüfer · Fachtest</div>
          <div style={{ display: "flex", fontSize: 58, fontWeight: 800, color: "#12201f", lineHeight: 1.1 }}>{r?.title ?? "Futtertest"}</div>
          <div style={{ display: "flex", alignItems: "center", gap: 24, marginTop: 12 }}>
            <div style={{ width: 170, height: 170, borderRadius: 999, border: `16px solid ${color}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "#fff" }}>
              <div style={{ display: "flex", fontSize: 64, fontWeight: 800, color }}>{score}</div>
              <div style={{ display: "flex", fontSize: 22, color: "#4b5f5d" }}>von 100</div>
            </div>
            <div style={{ display: "flex", fontSize: 30, color: "#4b5f5d", maxWidth: 420 }}>{r?.category.name ?? ""}</div>
          </div>
        </div>
      </div>
    ),
    size,
  );
}
