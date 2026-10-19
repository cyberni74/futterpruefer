import type { NextConfig } from "next";
import type { Redirect } from "next/dist/lib/load-custom-routes";
import { AMAZON_IMAGE_HOST, SUPABASE_IMAGE_HOST } from "./src/lib/image-hosts";
import { CANONICAL_ORIGIN, REDIRECT_HOSTS } from "./src/lib/site";

const isDev = process.env.NODE_ENV !== "production";

const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""} https://va.vercel-scripts.com https://challenges.cloudflare.com`,
  "style-src 'self' 'unsafe-inline'",
  `img-src 'self' data: blob: https://*.public.blob.vercel-storage.com https://${SUPABASE_IMAGE_HOST} https://${AMAZON_IMAGE_HOST}`,
  "font-src 'self' data:",
  "connect-src 'self' https://va.vercel-scripts.com https://vitals.vercel-insights.com",
  "frame-src https://challenges.cloudflare.com",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
  ...(isDev ? [] : ["upgrade-insecure-requests"]),
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), browsing-topics=()" },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  // Vom Build-Skript ermittelter DB-Host (falls der Host in DATABASE_URL nicht erreichbar war)
  env: { DB_HOST_OVERRIDE: process.env.DB_HOST_OVERRIDE ?? "" },
  images: {
    // Vercel-Bildoptimierung ist ausgeschöpft (HTTP 402). Bilder direkt ausliefern (Supabase, Blob, lokal).
    unoptimized: true,
    formats: ["image/avif", "image/webp"],
    qualities: [50, 75],
    deviceSizes: [360, 480, 640, 700, 750, 828, 1080, 1200, 1920],
    remotePatterns: [
      { protocol: "https", hostname: "*.public.blob.vercel-storage.com" },
      { protocol: "https", hostname: SUPABASE_IMAGE_HOST, pathname: "/storage/v1/object/public/bilder/**" },
    ],
  },
  serverExternalPackages: ["sharp"],
  // OG-Bilder lesen lokale Produktbilder aus /public
  outputFileTracingIncludes: { "/[kategorie]/[slug]/opengraph-image": ["./public/demo/**", "./public/uploads/**"] },
  async redirects() {
    const rules: Redirect[] = [
      { source: "/ueber-mich", destination: "/team", permanent: true },
      // Zusammengeführte Marken (siehe src/lib/brand-alias.ts)
      { source: "/marken/purina-gourmet", destination: "/marken/purina", permanent: true },
      { source: "/marken/purina-pro-plan", destination: "/marken/purina", permanent: true },
      // Frühere Profil-URLs unter /team/… gibt es nicht mehr.
      { source: "/team/:slug", destination: "/team", permanent: true },
    ];
    // www und die festen Produktions-vercel.app-Hosts → Hauptdomain, gleicher Pfad.
    // Vorschau-URLs (*.vercel.app außer den festen Hosts) bleiben erreichbar.
    // Die ASCII-Domain selbst wird hier nicht umgeleitet: Vercel leitet futterpruefer.de
    // an der Kante auf die Punycode-Hauptdomain. Die Gegenrichtung in der App ergäbe eine Schleife.
    for (const host of REDIRECT_HOSTS) {
      rules.push({
        source: "/:path*",
        has: [{ type: "host", value: host }],
        destination: `${CANONICAL_ORIGIN}/:path*`,
        statusCode: 301,
      });
    }
    return rules;
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
  turbopack: {
    rules: {
      "*.css": { loaders: ["@tailwindcss/turbopack"], as: "*.css" },
    },
  },
};

export default nextConfig;
