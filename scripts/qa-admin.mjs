// Admin-E2E: Login → Test anlegen → veröffentlichen → sofort öffentlich sichtbar → zurück auf Entwurf → nicht mehr sichtbar.
// Nutzung: ADMIN_EMAIL=… ADMIN_PASSWORD=… node scripts/qa-admin.mjs [baseUrl]
import "dotenv/config";
import { chromium } from "@playwright/test";
import { existsSync } from "node:fs";
const base = process.argv[2] ?? "http://localhost:3000";
const exe = ["/opt/pw-browsers/chromium-1194/chrome-linux/chrome"].find(existsSync);
const b = await chromium.launch(exe ? { executablePath: exe } : {});
const p = await b.newPage({ viewport: { width: 1366, height: 900 }, locale: "de-DE" });
const errs = []; p.on("pageerror", (e) => errs.push(String(e)));
const check = (name, ok) => { console.log(`${ok ? "✓" : "✗"} ${name}`); if (!ok) process.exitCode = 1; };
const title = `QA Testfutter ${Date.now()}`;

await p.goto(base + "/admin");
check("Weiterleitung zum Login", p.url().includes("/admin/login"));
await p.fill("#email", process.env.ADMIN_EMAIL);
await p.fill("#password", process.env.ADMIN_PASSWORD);
await p.getByRole("button", { name: "Anmelden" }).click();
await p.waitForURL((u) => !u.pathname.includes("/login"));
check("Login", true);

await p.goto(base + "/admin/tests/neu", { waitUntil: "networkidle" });
await p.getByLabel("Titel *").fill(title);
// Marke: vorhandene Liste → „Neue Marke anlegen“ → Freitext
if (await p.locator("select#brand").count()) await p.locator("select#brand").selectOption("__neu__");
await p.locator("input#brand").fill("QA-Marke");
await p.getByLabel("Produktname *").fill("Testfutter");
await p.getByLabel("Kategorie *").selectOption({ index: 1 });
for (const [k, v] of [["scoreRaw", 25], ["scoreHarmful", 18], ["scoreNutrients", 17], ["scoreDeclaration", 12], ["scoreNeeds", 8], ["scoreValue", 4]]) await p.fill(`#${k}`, String(v));
await p.getByLabel("Fazit (1–2 Sätze)").fill("Solides QA-Futter mit guter Deklaration.");
await p.getByPlaceholder("Pro-Punkt 1").fill("Gute Rohstoffe");
await p.getByPlaceholder("Pro-Punkt 2").fill("Klare Deklaration");
await p.getByPlaceholder("Contra-Punkt 1").fill("Teuer");
await p.getByPlaceholder("Contra-Punkt 2").fill("Kleine Dosen");
// Pflichtbilder: Verpackung + Futter selbst
await p.getByLabel("Bild 1: Verpackung").setInputFiles("public/demo/bellwerk-classic-mix-huhn.webp");
await p.getByText("Bild hochgeladen und als WebP optimiert.").first().waitFor({ timeout: 15000 });
await p.getByLabel(/Bild 2: Produkt selbst/).setInputFiles("public/demo/bellwerk-classic-mix-huhn-inhalt.webp");
await p.getByText("Bild hochgeladen und als WebP optimiert.").nth(1).waitFor({ timeout: 15000 });
check("Beide Bilder hochgeladen, Alt-Vorschläge gesetzt", (await p.locator("input[name=imageAlt]").inputValue()).startsWith("Verpackung von") && (await p.locator("input[name=contentImageAlt]").inputValue()).startsWith("Inhalt von"));
await p.getByText("Veröffentlichen sofort").click();
await p.getByRole("button", { name: /Speichern/ }).first().click();
await p.waitForURL(/\/admin\/tests\/(?!neu)[a-z0-9]+/, { timeout: 15000 });
await p.waitForLoadState("networkidle");
const slug = await p.locator("input[name=slug]").inputValue();
check(`Gespeichert (Slug ${slug})`, !!slug);

const pub = await p.request.get(`${base}/tests/${slug}`);
console.log("  → ", pub.status(), pub.url());
check("Testseite sofort öffentlich (200)", pub.status() === 200);
check("Gesamtpunkte 84 auf Testseite", (await pub.text()).includes("84 von 100"));
const home = await (await p.request.get(base + "/")).text();
check("Startseite sofort aktualisiert", home.includes(title));

await p.getByText("Entwurf", { exact: true }).first().click();
await p.getByRole("button", { name: /Speichern/ }).first().click();
await p.waitForTimeout(2500);
check("Nach Entwurf: Testseite 404", (await p.request.get(`${base}/tests/${slug}`)).status() === 404);
check("Nach Entwurf: nicht mehr auf Startseite", !(await (await p.request.get(base + "/")).text()).includes(title));
check("keine Seitenfehler", errs.length === 0);
if (errs.length) console.log(errs);
console.log("SLUG=" + slug);
await b.close();
