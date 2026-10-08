// Rendert Seiten mobil + desktop, sammelt Konsolenfehler, speichert Screenshots.
// Nutzung: node scripts/smoke.mjs [baseUrl] /pfad1 /pfad2 ...
import { chromium } from "@playwright/test";
import { existsSync } from "node:fs";

const [base = "http://localhost:3000", ...paths] = process.argv.slice(2);
const exe = ["/opt/pw-browsers/chromium-1194/chrome-linux/chrome"].find(existsSync);
const browser = await chromium.launch(exe ? { executablePath: exe } : {});
const results = [];
for (const [name, vp] of [["mobile", { width: 390, height: 844 }], ["desktop", { width: 1366, height: 900 }]]) {
  const ctx = await browser.newContext({ viewport: vp, locale: "de-DE", reducedMotion: "reduce" });
  for (const p of paths.length ? paths : ["/"]) {
    const page = await ctx.newPage();
    const errors = [];
    const ignore = (t) => /ERR_TUNNEL_CONNECTION_FAILED|va\.vercel-scripts\.com|_vercel\/insights/.test(t);
    page.on("console", (m) => m.type() === "error" && !ignore(m.text()) && !m.text().startsWith("Failed to load resource") && errors.push(m.text()));
    page.on("response", (r) => r.status() >= 400 && !ignore(r.url()) && r.url() !== page.url() && errors.push(`${r.status()} ${r.url()}`));
    page.on("pageerror", (e) => errors.push(String(e)));
    const res = await page.goto(base + p, { waitUntil: "networkidle" });
    await page.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 600) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 60)); } window.scrollTo(0, 0); });
    await page.waitForLoadState("networkidle");
    await page.addStyleTag({ content: "[aria-label='Datenschutzhinweis']{display:none!important}" });
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1
      ? [...document.querySelectorAll("body *")].filter((e) => e.getBoundingClientRect().right > innerWidth + 1).slice(0, 4).map((e) => `${e.tagName}.${String(e.className).slice(0, 60)}`).join(" | ") || "unbekannt"
      : false) && (await page.evaluate(() => `sw=${document.documentElement.scrollWidth} bw=${document.body.scrollWidth} iw=${innerWidth} cw=${document.documentElement.clientWidth}`));
    const text = (await page.locator("main").innerText().catch(() => "")).length;
    const file = `screenshots/${name}${p.replace(/[^a-z0-9]+/gi, "_")}.png`;
    await page.screenshot({ path: file, fullPage: true });
    results.push({ vp: name, path: p, status: res?.status(), textLen: text, overflow, errors, file });
    await page.close();
  }
  await ctx.close();
}
await browser.close();
console.log(JSON.stringify(results, null, 1));
process.exit(results.some((r) => r.errors.length || r.overflow || (r.status ?? 500) >= 400) ? 1 : 0);
