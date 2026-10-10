import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV !== "production";

const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""} https://va.vercel-scripts.com https://challenges.cloudflare.com`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://*.public.blob.vercel-storage.com",
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
    formats: ["image/avif", "image/webp"],
    qualities: [50, 75],
    deviceSizes: [360, 480, 640, 700, 750, 828, 1080, 1200, 1920],
    remotePatterns: [{ protocol: "https", hostname: "*.public.blob.vercel-storage.com" }],
  },
  serverExternalPackages: ["sharp"],
  // OG-Bilder lesen lokale Produktbilder aus /public
  outputFileTracingIncludes: { "/[kategorie]/[slug]/opengraph-image": ["./public/demo/**", "./public/uploads/**"] },
  async redirects() {
    const rules: Array<{ source: string; destination: string; permanent: boolean; has?: Array<{ type: "host"; value: string }> }> = [
      { source: "/ueber-mich", destination: "/team", permanent: true },
      // Frühere Profil-URLs unter /team/… gibt es nicht mehr.
      { source: "/team/:slug", destination: "/team", permanent: true },
    ];
    // Alle bekannten vercel.app-Adressen des Projekts leiten auf die Hauptdomain (nur eine Adresse für Google).
    // Nur aktiv, wenn NEXT_PUBLIC_SITE_URL auf eine echte Domain zeigt; Vorschau-Deployments bleiben erreichbar.
    const site = (process.env.NEXT_PUBLIC_SITE_URL ?? "").replace(/\/$/, "");
    if (site && !/vercel\.app|localhost|127\.0\.0\.1/.test(site)) {
      for (const host of ["futterpruefer.vercel.app", "futterpruefer-bernhardehmer-3885s-projects.vercel.app", "futterpruefer-git-main-bernhardehmer-3885s-projects.vercel.app"]) {
        rules.push({ source: "/:path*", has: [{ type: "host", value: host }], destination: `${site}/:path*`, permanent: true });
      }
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
