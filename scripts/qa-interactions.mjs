// Interaktions-QA: Suche, Dark Mode, Vergleich, Kontaktformular. Nutzung: node scripts/qa-interactions.mjs [baseUrl]
import { chromium } from "@playwright/test";
import { existsSync } from "node:fs";
const exe = ["/opt/pw-browsers/chromium-1194/chrome-linux/chrome"].find(existsSync);
const b = await chromium.launch(exe ? { executablePath: exe } : {});
const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, locale: "de-DE" });
const p = await ctx.newPage();
const errs = []; p.on("pageerror", (e) => errs.push(String(e)));
const base = process.argv[2] ?? "http://localhost:3000";
const check = (name, ok) => { console.log(`${ok ? "✓" : "✗"} ${name}`); if (!ok) process.exitCode = 1; };

await p.goto(base + "/", { waitUntil: "networkidle" });
await p.getByRole("button", { name: "Verstanden" }).click();
await p.getByRole("navigation", { name: "App-Navigation" }).getByRole("button", { name: "Suche" }).click();
await p.getByRole("combobox", { name: "Suchbegriff" }).fill("nordrudl");
await p.waitForSelector("[role=option]");
check("Live-Vorschläge mit Tippfehler", (await p.locator("[role=option]").count()) >= 2);
await p.keyboard.press("ArrowDown"); await p.keyboard.press("Enter");
await p.waitForURL(/\/alleinfuttermittel-hund\//);
check("Tastaturnavigation öffnet Test", /\/alleinfuttermittel-hund\/nordrudel/.test(p.url()));

await p.getByRole("button", { name: "Dunklen Modus aktivieren" }).click();
await p.reload({ waitUntil: "networkidle" });
check("Dark Mode bleibt nach Reload", await p.evaluate(() => document.documentElement.classList.contains("dark")));
await p.screenshot({ path: "screenshots/dark-review.png" });

await p.goto(base + "/alleinfuttermittel-hund", { waitUntil: "networkidle" });
const boxes = p.getByRole("checkbox", { name: "Vergleichen" });
await boxes.nth(0).check(); await boxes.nth(1).check();
await p.getByRole("link", { name: "Vergleichen", exact: true }).click();
await p.waitForURL(/vergleich/); await p.waitForLoadState("networkidle");
check("Vergleichstabelle", (await p.locator("tbody tr").count()) >= 8);
await p.screenshot({ path: "screenshots/dark-compare.png", fullPage: true });

await p.goto(base + "/kontakt?typ=hersteller", { waitUntil: "networkidle" });
await p.getByLabel("Name").fill("Testfirma");
await p.getByLabel("E-Mail").fill(`qa${Date.now()}@example.com`);
await p.getByLabel("Unternehmen").fill("Test GmbH");
await p.getByLabel("Nachricht").fill("Kurz");
await p.waitForTimeout(3200);
await p.getByRole("button", { name: "Nachricht senden" }).click();
await p.getByText("mindestens 20 Zeichen").waitFor();
check("Validierungsfehler angezeigt", await p.getByText("Bitte der Datenverarbeitung").isVisible());
check("Eingaben bleiben erhalten", (await p.getByLabel("Name").inputValue()) === "Testfirma");
await p.getByLabel("Nachricht").fill("Wir möchten gern unser neues Produkt zur Prüfung einreichen.");
await p.getByRole("checkbox").check();
await p.getByRole("button", { name: "Nachricht senden" }).click();
await p.getByText("Vielen Dank").waitFor({ timeout: 10000 });
check("Kontaktformular gesendet", true);
check("keine Seitenfehler", errs.length === 0);
if (errs.length) console.log(errs);
await b.close();
