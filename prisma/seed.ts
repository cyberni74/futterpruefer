import "dotenv/config";
import { mkdir } from "node:fs/promises";
import path from "node:path";
import bcrypt from "bcryptjs";
import sharp from "sharp";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";
import { totalScore } from "../src/lib/scoring";
import { slugify } from "../src/lib/slug";
import { pgConfig } from "../src/lib/pg-config";
import { autolinkUrls } from "../src/lib/autolink";
import { NISCHEN_POSTS } from "./blog-nischen";
import { RECHERCHE_POSTS } from "./blog-recherche";
import { ULMENRINDE_POSTS } from "./blog-ulmenrinde";
import { HERSTELLER_POSTS } from "./blog-hersteller";
import { WERBUNG_POSTS } from "./blog-werbung";
import { DENTAL_POSTS } from "./blog-dental";
import { ULMENRINDE_ANWENDER_HTML, ULMENRINDE_ANWENDER_MARKER } from "./blog-ulmenrinde-anwender";
import { BLOG_BODY_IMAGES } from "./blog-bilder";
import { REVIEW_TEASERS, REVIEW_TEASERS_PREVIOUS } from "./review-teasers";
import { MEDIDOG_TEST, MEDIDOG_V1_SIGNATURE } from "./review-medidog";
import { MAMMALY_TESTS } from "./review-mammaly";
import { BUGBELL_TESTS } from "./review-bugbell";
import { BETTERCAT_TESTS } from "./review-betterkat";
import { WOLFSBLUT_TESTS } from "./review-wolfsblut";
import { MAMMALY_BLOG_SECTIONS, MAMMALY_BLOGS_MARKER } from "./review-mammaly-blogs";

const esc = (t: string) => t.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const prisma = new PrismaClient({ adapter: new PrismaPg(pgConfig(process.env.DATABASE_URL!)) });

const DEMO_NOTE = "<p><em>Hinweis: Dies ist ein Demo-Beispieltest mit fiktiver Marke. Vor dem Livegang durch echte Tests ersetzen.</em></p>";

async function demoImage(file: string, brand: string, product: string, hue: number) {
  const dir = path.join(process.cwd(), "public", "demo");
  await mkdir(dir, { recursive: true });
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="900" viewBox="0 0 1200 900">
  <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="hsl(${hue},45%,92%)"/><stop offset="1" stop-color="hsl(${hue},40%,82%)"/></linearGradient>
  <linearGradient id="p" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="hsl(${hue},55%,38%)"/><stop offset="1" stop-color="hsl(${hue},60%,26%)"/></linearGradient></defs>
  <rect width="1200" height="900" fill="url(#g)"/>
  <ellipse cx="600" cy="790" rx="260" ry="34" fill="rgba(0,0,0,.12)"/>
  <path d="M410 170 Q600 130 790 170 L830 770 Q600 800 370 770 Z" fill="url(#p)"/>
  <rect x="430" y="300" width="340" height="250" rx="22" fill="rgba(255,255,255,.92)"/>
  <text x="600" y="385" font-family="Arial, sans-serif" font-size="46" font-weight="700" text-anchor="middle" fill="hsl(${hue},55%,25%)">${esc(brand)}</text>
  <text x="600" y="445" font-family="Arial, sans-serif" font-size="28" text-anchor="middle" fill="#334">${esc(product)}</text>
  <text x="600" y="505" font-family="Arial, sans-serif" font-size="22" text-anchor="middle" fill="#667">DEMO</text>
  <circle cx="600" cy="640" r="46" fill="rgba(255,255,255,.18)"/>
</svg>`;
  await sharp(Buffer.from(svg)).webp({ quality: 80 }).toFile(path.join(dir, file));
  const blur = await sharp(Buffer.from(svg)).resize(16).webp({ quality: 40 }).toBuffer();
  return { url: `/demo/${file}`, blur: `data:image/webp;base64,${blur.toString("base64")}` };
}

type Form = "kroketten" | "brocken" | "paste" | "sticks" | "taler";

function formFor(d: { product: string; keyword: string }): Form {
  if (/stick|wurzel/i.test(d.product)) return "sticks";
  if (/paste/i.test(d.keyword)) return "paste";
  if (/leckerli|taler/i.test(`${d.keyword} ${d.product}`)) return "taler";
  if (/trocken/i.test(d.keyword)) return "kroketten";
  return "brocken";
}

const FORM_LABEL: Record<Form, string> = { kroketten: "Kroketten", brocken: "Brocken in Soße", paste: "Paste", sticks: "Kaustangen", taler: "Taler" };

/** Demo-Bild 2: das Futter selbst auf einem Teller (deterministisch je Produkt). */
async function demoContentImage(file: string, form: Form, hue: number) {
  const dir = path.join(process.cwd(), "public", "demo");
  await mkdir(dir, { recursive: true });
  let seed = hue * 7 + form.length;
  const rnd = () => ((seed = (seed * 9301 + 49297) % 233280) / 233280);
  const brown = (l: number) => `hsl(${25 + Math.round(rnd() * 12)},${45 + Math.round(rnd() * 15)}%,${l + Math.round(rnd() * 8)}%)`;
  const pieces: string[] = [];
  const inPlate = () => { for (;;) { const x = 600 + (rnd() * 2 - 1) * 300, y = 470 + (rnd() * 2 - 1) * 190; if (((x - 600) / 300) ** 2 + ((y - 470) / 190) ** 2 < 0.85) return [x, y]; } };
  if (form === "kroketten") for (let i = 0; i < 70; i++) { const [x, y] = inPlate(); pieces.push(`<ellipse cx="${x}" cy="${y}" rx="${20 + rnd() * 6}" ry="${15 + rnd() * 5}" transform="rotate(${rnd() * 180} ${x} ${y})" fill="${brown(28)}" stroke="rgba(0,0,0,.25)" stroke-width="2"/>`); }
  if (form === "taler") for (let i = 0; i < 28; i++) { const [x, y] = inPlate(); pieces.push(`<circle cx="${x}" cy="${y}" r="${30 + rnd() * 6}" fill="${brown(45)}" stroke="rgba(0,0,0,.22)" stroke-width="3"/><circle cx="${x}" cy="${y}" r="8" fill="rgba(0,0,0,.12)"/>`); }
  if (form === "brocken") {
    pieces.push(`<ellipse cx="600" cy="470" rx="270" ry="170" fill="hsl(28,45%,52%)" opacity=".55"/>`);
    for (let i = 0; i < 26; i++) { const [x, y] = inPlate(); const w = 48 + rnd() * 30, h = 34 + rnd() * 22; pieces.push(`<rect x="${x - w / 2}" y="${y - h / 2}" width="${w}" height="${h}" rx="12" transform="rotate(${rnd() * 90 - 45} ${x} ${y})" fill="${brown(30)}" stroke="rgba(0,0,0,.2)" stroke-width="2"/>`); }
  }
  if (form === "sticks") for (let i = 0; i < 6; i++) { const y = 360 + i * 44, x = 380 + rnd() * 50; pieces.push(`<rect x="${x}" y="${y}" width="${400 + rnd() * 40}" height="34" rx="17" transform="rotate(${rnd() * 10 - 5} 600 ${y})" fill="${brown(36)}" stroke="rgba(0,0,0,.25)" stroke-width="3"/>`); }
  if (form === "paste") pieces.push(`<path d="M420 470 C 470 380, 560 520, 620 430 S 760 380, 790 480 C 740 560, 620 520, 560 560 S 440 560, 420 470 Z" fill="hsl(22,78%,63%)" stroke="rgba(0,0,0,.18)" stroke-width="3"/><path d="M500 460 C 540 430, 600 470, 660 445" stroke="rgba(255,255,255,.6)" stroke-width="10" fill="none" stroke-linecap="round"/>`);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="900" viewBox="0 0 1200 900">
  <rect width="1200" height="900" fill="hsl(${hue},25%,93%)"/>
  <rect y="620" width="1200" height="280" fill="hsl(30,25%,80%)"/>
  <ellipse cx="600" cy="500" rx="380" ry="240" fill="rgba(0,0,0,.10)"/>
  <ellipse cx="600" cy="470" rx="370" ry="230" fill="#fafafa" stroke="#ddd" stroke-width="4"/>
  <ellipse cx="600" cy="470" rx="310" ry="195" fill="#f1f1f1"/>
  ${pieces.join("")}
  <text x="1160" y="870" font-family="Arial, sans-serif" font-size="24" text-anchor="end" fill="#667">DEMO · ${FORM_LABEL[form]}</text>
</svg>`;
  await sharp(Buffer.from(svg)).webp({ quality: 80 }).toFile(path.join(dir, file));
  const blur = await sharp(Buffer.from(svg)).resize(16).webp({ quality: 40 }).toBuffer();
  return { url: `/demo/${file}`, blur: `data:image/webp;base64,${blur.toString("base64")}`, label: FORM_LABEL[form] };
}

async function blogImage(file: string, title: string, hue: number) {
  const dir = path.join(process.cwd(), "public", "demo");
  await mkdir(dir, { recursive: true });
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="675">
  <rect width="1200" height="675" fill="hsl(${hue},40%,90%)"/>
  <circle cx="980" cy="120" r="220" fill="hsl(${hue},45%,80%)"/>
  <circle cx="160" cy="600" r="180" fill="hsl(${hue},45%,84%)"/>
  <text x="80" y="360" font-family="Georgia, serif" font-size="58" font-weight="700" fill="hsl(${hue},50%,22%)">${esc(title)}</text>
</svg>`;
  await sharp(Buffer.from(svg)).webp({ quality: 80 }).toFile(path.join(dir, file));
  const blur = await sharp(Buffer.from(svg)).resize(16).webp({ quality: 40 }).toBuffer();
  return { url: `/demo/${file}`, blur: `data:image/webp;base64,${blur.toString("base64")}` };
}

const CATEGORIES = [
  { slug: "alleinfuttermittel-hund", name: "Alleinfuttermittel für Hunde", shortName: "Alleinfuttermittel Hund", animal: "HUND", foodType: "ALLEIN", sortOrder: 1, description: "Vollwertige Futtermittel, die den gesamten Nährstoffbedarf eines Hundes decken sollen." },
  { slug: "alleinfuttermittel-katze", name: "Alleinfuttermittel für Katzen", shortName: "Alleinfuttermittel Katze", animal: "KATZE", foodType: "ALLEIN", sortOrder: 2, description: "Vollwertige Futtermittel, die den gesamten Nährstoffbedarf einer Katze decken sollen." },
  { slug: "ergaenzungsfuttermittel-hund", name: "Ergänzungsfuttermittel für Hunde", shortName: "Ergänzungsfuttermittel Hund", animal: "HUND", foodType: "ERGAENZUNG", sortOrder: 3, description: "Snacks, Kauartikel und Zusätze, die eine Ration ergänzen – nicht ersetzen." },
  { slug: "ergaenzungsfuttermittel-katze", name: "Ergänzungsfuttermittel für Katzen", shortName: "Ergänzungsfuttermittel Katze", animal: "KATZE", foodType: "ERGAENZUNG", sortOrder: 4, description: "Snacks, Pasten und Zusätze, die eine Ration für Katzen ergänzen." },
] as const;

type Demo = {
  brand: string; product: string; cat: (typeof CATEGORIES)[number]["slug"]; keyword: string; price: "GUENSTIG" | "MITTEL" | "PREMIUM"; perKg: number;
  s: [number, number, number, number, number, number]; verdict: string; pros: string[]; cons: string[]; hue: number; daysAgo: number;
};

const DEMOS: Demo[] = [
  { brand: "Hofgrün", product: "Rind & Pastinake", cat: "alleinfuttermittel-hund", keyword: "Nassfutter, Monoprotein", price: "PREMIUM", perKg: 9.8, s: [27, 19, 18, 14, 9, 3], verdict: "Hochwertige, klar deklarierte Rezeptur mit einer tierischen Proteinquelle. Ideal auch für empfindliche Hunde.", pros: ["Offene Deklaration mit Prozentangaben", "Eine einzige tierische Proteinquelle", "Keine Zucker- oder Aromazusätze"], cons: ["Hoher Preis pro Kilogramm", "Jodgehalt am unteren Rand"], hue: 150, daysAgo: 2 },
  { brand: "Nordrudel", product: "Lachs Adult Trocken", cat: "alleinfuttermittel-hund", keyword: "Trockenfutter, getreidefrei", price: "MITTEL", perKg: 6.4, s: [22, 17, 16, 11, 8, 4], verdict: "Solides Trockenfutter mit gutem Fettsäureprofil, die Erbsenanteile drücken jedoch die Rohstoffnote.", pros: ["Gutes Omega-3-Profil", "Faires Preis-Leistungs-Verhältnis"], cons: ["Hoher Anteil Hülsenfrüchte", "Werbeaussage „natürlich“ unscharf"], hue: 200, daysAgo: 6 },
  { brand: "Bellwerk", product: "Classic Mix Huhn", cat: "alleinfuttermittel-hund", keyword: "Trockenfutter, Discount", price: "GUENSTIG", perKg: 2.1, s: [9, 7, 12, 5, 6, 4], verdict: "Günstig, aber mit unklarer Deklaration und Zuckerzusatz. Für die tägliche Fütterung nicht empfehlenswert.", pros: ["Sehr niedriger Preis", "Bedarfsdeckende Vitaminierung"], cons: ["Zucker und Farbstoffe zugesetzt", "Sammelbezeichnungen statt klarer Rohstoffe", "Hoher Getreideanteil"], hue: 20, daysAgo: 11 },
  { brand: "Feldtafel", product: "Senior Pute & Kürbis", cat: "alleinfuttermittel-hund", keyword: "Nassfutter, Senior", price: "MITTEL", perKg: 6.9, s: [24, 18, 17, 13, 9, 4], verdict: "Gut verträgliche Senior-Rezeptur mit angepasstem Phosphorgehalt und sauberer Deklaration.", pros: ["Moderater Phosphorgehalt", "Transparente Zusammensetzung"], cons: ["Kleine Dosen erzeugen viel Verpackungsmüll"], hue: 35, daysAgo: 15 },
  { brand: "Samtkralle", product: "Huhn pur in Brühe", cat: "alleinfuttermittel-katze", keyword: "Nassfutter, Monoprotein", price: "PREMIUM", perKg: 12.5, s: [28, 19, 18, 14, 9, 2], verdict: "Sehr fleischbetonte Rezeptur mit hervorragender Taurinversorgung. Teuer, aber fachlich überzeugend.", pros: ["Hoher Fleischanteil", "Taurin bedarfsgerecht ergänzt", "Keine pflanzlichen Füllstoffe"], cons: ["Sehr hoher Preis"], hue: 280, daysAgo: 3 },
  { brand: "Katzenkontor", product: "Indoor Trocken", cat: "alleinfuttermittel-katze", keyword: "Trockenfutter, Wohnungskatze", price: "MITTEL", perKg: 8.2, s: [16, 15, 14, 9, 6, 3], verdict: "Akzeptabel, aber der hohe Kohlenhydratanteil passt nicht zum Bedarf einer reinen Fleischfresserin.", pros: ["Gute Akzeptanz", "Bedarfsdeckende Mineralisierung"], cons: ["Hoher Kohlenhydratanteil", "Tierische Nebenerzeugnisse nicht spezifiziert"], hue: 260, daysAgo: 9 },
  { brand: "Miaurant", product: "Gourmet Fisch-Cocktail", cat: "alleinfuttermittel-katze", keyword: "Nassfutter, Fisch", price: "GUENSTIG", perKg: 4.3, s: [12, 8, 13, 6, 6, 4], verdict: "Aromatisiert und mit Zucker versetzt – die Schadstoffkategorie fällt durch. Nicht für die Dauerfütterung.", pros: ["Günstig", "Hohe Akzeptanz"], cons: ["Zuckerzusatz", "Nur 4 % deklarierter Fisch", "Irreführende „Gourmet“-Aufmachung"], hue: 190, daysAgo: 13 },
  { brand: "Hofgrün", product: "Kauwurzel Ziege", cat: "ergaenzungsfuttermittel-hund", keyword: "Kausnack, Monoprotein", price: "MITTEL", perKg: 24.0, s: [26, 19, 15, 13, 8, 3], verdict: "Naturbelassener Kausnack mit einer einzigen Zutat. Gut geeignet für Allergiker.", pros: ["Nur eine Zutat", "Lange Kaudauer"], cons: ["Starker Eigengeruch"], hue: 90, daysAgo: 5 },
  { brand: "Bellwerk", product: "Dental Sticks", cat: "ergaenzungsfuttermittel-hund", keyword: "Zahnpflege-Snack", price: "GUENSTIG", perKg: 11.0, s: [10, 9, 10, 6, 5, 3], verdict: "Hoher Zucker- und Stärkeanteil, der Zahnpflege-Nutzen ist nicht belegt.", pros: ["Gut dosierbar"], cons: ["Zucker als Zutat", "Werbeversprechen nicht belegt", "Viele Zusatzstoffe"], hue: 10, daysAgo: 18 },
  { brand: "Samtkralle", product: "Lachsöl-Paste", cat: "ergaenzungsfuttermittel-katze", keyword: "Paste, Omega-3", price: "MITTEL", perKg: 38.0, s: [23, 18, 17, 12, 8, 3], verdict: "Sinnvolle Ergänzung zur Omega-3-Versorgung mit klarer Dosierempfehlung.", pros: ["Klare Dosierung", "Hoher EPA/DHA-Gehalt"], cons: ["Malzextrakt als Geschmacksträger"], hue: 330, daysAgo: 8 },
  { brand: "Katzenkontor", product: "Knusper-Taler Huhn", cat: "ergaenzungsfuttermittel-katze", keyword: "Leckerli", price: "GUENSTIG", perKg: 19.0, s: [14, 12, 11, 8, 6, 3], verdict: "Als gelegentliches Leckerli vertretbar, der Getreideanteil ist jedoch hoch.", pros: ["Kleine Stückgröße", "Ohne Farbstoffe"], cons: ["Hoher Getreideanteil", "Fleischanteil unklar"], hue: 45, daysAgo: 20 },
  { brand: "Nordrudel", product: "Wild & Süßkartoffel", cat: "alleinfuttermittel-hund", keyword: "Nassfutter, Allergiker", price: "PREMIUM", perKg: 10.5, s: [26, 20, 18, 14, 9, 3], verdict: "Hervorragende Hypoallergen-Option mit exotischer Proteinquelle und tadelloser Deklaration.", pros: ["Exotische Proteinquelle", "Keine bedenklichen Zusätze", "Vollständig offene Deklaration"], cons: ["Hoher Preis"], hue: 120, daysAgo: 1 },
];

async function main() {
  const email = (process.env.ADMIN_EMAIL ?? "admin@futterpruefer.de").toLowerCase();
  const password = process.env.ADMIN_PASSWORD;
  if (password && password.length >= 12) {
    // ADMIN_PASSWORD ist die Quelle der Wahrheit: Änderung + Redeploy setzt das Passwort neu.
    const passwordHash = await bcrypt.hash(password, 12);
    await prisma.adminUser.upsert({ where: { email }, update: { passwordHash }, create: { email, name: "Redaktion", passwordHash } });
  } else {
    console.warn("ADMIN_PASSWORD fehlt oder ist kürzer als 12 Zeichen – Admin-Konto unverändert.");
  }

  const cats: Record<string, string> = {};
  for (const c of CATEGORIES) {
    const row = await prisma.category.upsert({ where: { slug: c.slug }, update: { ...c }, create: { ...c } });
    cats[c.slug] = row.id;
  }

  await seedLexikonAndGlossary();
  await ensureFaq();
  await ensureNischenPosts();
  await ensureBlogBodyImages();
  await ensureUlmenrindeAnwender();
  await ensureReviewTeasers();
  await ensureMedidogTest();
  await ensureMammalyTests();
  await ensureMammalyBlogs();
  await normalizeStoredLinks();
  // Demo-Inhalte (fiktive Tests, Blog, Ticker) nur auf ausdrücklichen Wunsch: SEED_DEMO=1.
  // Verhindert, dass sie nach dem Löschen bei einem Deploy wieder auftauchen.
  if (process.env.SEED_DEMO !== "1" || (await prisma.review.count()) > 0) {
    console.log("Demo-Inhalte übersprungen.");
    await ensureDemoDetails();
    await ensureDemoContentImages();
    return;
  }

  const ids: string[] = [];
  for (const [i, d] of DEMOS.entries()) {
    const title = `${d.brand} ${d.product}`;
    const slug = slugify(title);
    const img = await demoImage(`${slug}.webp`, d.brand, d.product, d.hue);
    const scores = { scoreRaw: d.s[0], scoreHarmful: d.s[1], scoreNutrients: d.s[2], scoreDeclaration: d.s[3], scoreNeeds: d.s[4], scoreValue: d.s[5] };
    const r = await prisma.review.create({
      data: {
        slug, title, brand: d.brand, productName: d.product, keyword: d.keyword,
        categoryId: cats[d.cat], priceClass: d.price, pricePerKg: d.perKg,
        imageUrl: img.url, imageBlur: img.blur, imageAlt: `Verpackung von ${title}`,
        ...scores, totalScore: totalScore(scores),
        verdict: d.verdict, pros: d.pros, cons: d.cons,
        bodyHtml: `${DEMO_NOTE}<h2>Zusammensetzung</h2><p>${title} wurde anhand der deklarierten Zusammensetzung, der analytischen Bestandteile und der Zusatzstoffe bewertet.</p><h2>Rohstoffe im Detail</h2><p>${d.verdict}</p><h3>Analytische Bestandteile</h3><table><thead><tr><th scope="col">Bestandteil</th><th scope="col">Gehalt</th></tr></thead><tbody><tr><td>Rohprotein</td><td>${(9 + (i % 5) * 2).toFixed(1)} %</td></tr><tr><td>Rohfett</td><td>${(5 + (i % 4)).toFixed(1)} %</td></tr><tr><td>Rohasche</td><td>${(1.8 + (i % 3) * 0.3).toFixed(1)} %</td></tr></tbody></table><h2>Fazit</h2><p>${d.verdict}</p>`,
        metaTitle: `${title} im Test: ${totalScore(scores)}/100 Punkte`,
        metaDescription: `${title} im Fachtest: ${d.verdict}`.slice(0, 158),
        keywords: [d.brand, d.product, ...d.keyword.split(", ")],
        status: "PUBLISHED",
        publishedAt: new Date(Date.now() - d.daysAgo * 86400000),
      },
    });
    ids.push(r.id);
  }

  const posts = [
    { title: "Alleinfuttermittel oder Ergänzungsfuttermittel – was ist der Unterschied?", excerpt: "Warum die Bezeichnung auf dem Etikett rechtlich entscheidend ist und was sie über die Bedarfsdeckung verrät.", hue: 170 },
    { title: "Zucker im Tierfutter: Wo er sich versteckt", excerpt: "Karamell, Melasse, Malzextrakt: So erkennen Sie zugesetzten Zucker in der Zusammensetzung.", hue: 30 },
    { title: "Taurin: Warum Katzen es zwingend brauchen", excerpt: "Ein Taurinmangel kann schwere Herzerkrankungen auslösen. Worauf Sie beim Katzenfutter achten sollten.", hue: 280 },
    { title: "Futterdeklaration richtig lesen", excerpt: "Offene vs. geschlossene Deklaration, Prozentangaben und Sammelbezeichnungen verständlich erklärt.", hue: 200 },
    { title: "Getreidefrei – sinnvoll oder Marketing?", excerpt: "Was hinter dem Trend steckt und für welche Hunde getreidefreies Futter tatsächlich Vorteile bringt.", hue: 60 },
  ];
  for (const [i, p] of posts.entries()) {
    const slug = slugify(p.title);
    await prisma.blogPost.create({
      data: {
        slug, title: p.title, excerpt: p.excerpt,
        ...(await blogImage(`blog-${slug}.webp`, p.title.split(" ").slice(0, 3).join(" "), p.hue).then((im) => ({ imageUrl: im.url, imageBlur: im.blur }))),
        imageAlt: p.title,
        bodyHtml: `<p>${p.excerpt}</p><h2>Das Wichtigste vorab</h2><p>Demo-Artikel: Hier steht der Fachbeitrag. Ersetzen Sie diesen Text im Admin-Bereich.</p><h2>Was bedeutet das für die Praxis?</h2><ul><li>Etikett vollständig lesen</li><li>Auf die Bezeichnung „Alleinfuttermittel“ achten</li><li>Bei Unklarheiten den Hersteller fragen</li></ul>`,
        metaTitle: p.title, metaDescription: p.excerpt, keywords: [],
        status: "PUBLISHED", publishedAt: new Date(Date.now() - (i * 4 + 1) * 86400000),
      },
    });
  }

  const now = new Date();
  for (let k = 0; k < 3; k++) {
    const d = new Date(now.getFullYear(), now.getMonth() - k, 1);
    await prisma.productOfMonth.create({
      data: {
        year: d.getFullYear(), month: d.getMonth() + 1, reviewId: ids[[11, 4, 0][k]],
        reason: ["Beste Gesamtnote des Monats mit makelloser Schadstoffbewertung und vollständig offener Deklaration.", "Fleischbetonte Rezeptur mit hervorragender Taurinversorgung – fachlich das überzeugendste Katzenfutter im Test.", "Klar deklariertes Monoprotein-Futter ohne Zusätze, ideal für empfindliche Hunde."][k],
      },
    });
  }

  await prisma.tickerItem.createMany({
    data: [
      { text: "Rückruf (Demo): Charge 2026-09 eines fiktiven Trockenfutters wegen erhöhter Aflatoxinwerte", href: "/blog", isWarning: true },
      { text: "Neu: Unsere Methodik wurde um die Bewertung von Werbeaussagen erweitert", href: "/methodik", isWarning: false },
    ],
  });

  await prisma.faqItem.createMany({
    data: [
      { sortOrder: 1, question: "Wie entstehen die Bewertungen?", answer: "Jedes Produkt wird anhand von sechs Kriterien mit insgesamt maximal 100 Punkten bewertet. Die Gewichtung ist auf der Methodik-Seite offengelegt." },
      { sortOrder: 2, question: "Können Hersteller eine bessere Note kaufen?", answer: "Nein. Hersteller können Produkte zur Prüfung einreichen, haben aber keinerlei Einfluss auf das Ergebnis." },
      { sortOrder: 3, question: "Wie oft werden Tests aktualisiert?", answer: "Bei Rezepturänderungen oder neuen Erkenntnissen wird ein Test überarbeitet. Das Datum der letzten Aktualisierung steht auf jeder Testseite." },
      { sortOrder: 4, question: "Ersetzt ein Test die tierärztliche Beratung?", answer: "Nein. Bei Erkrankungen oder speziellen Bedürfnissen sollte die Fütterung immer mit einer Tierärztin oder einem Tierarzt abgestimmt werden." },
    ],
  });

  await ensureFaq();
  await ensureDemoDetails();
  await ensureDemoContentImages();
  console.log(`Seed fertig: ${ids.length} Tests, ${posts.length} Blogartikel.`);
}

// ---------------------------------------------------------------------------
// Lexikon & Glossar (nur wenn leer)
// ---------------------------------------------------------------------------
const LEXIKON: Array<{ name: string; synonyms: string[]; group: string; concern: "UNBEDENKLICH" | "EINGESCHRAENKT" | "BEDENKLICH"; short: string; assessment: string }> = [
  { name: "Taurin", synonyms: ["Taurine"], group: "Nährstoff", concern: "UNBEDENKLICH", short: "Aminosulfonsäure, die Katzen nur unzureichend selbst bilden – sie muss mit der Nahrung zugeführt werden.", assessment: "Für Katzen lebensnotwendig. Ein Mangel kann zu Herzmuskelerkrankungen (dilatative Kardiomyopathie) und Netzhautschäden führen. Ein Zusatz in Katzenfutter ist sinnvoll." },
  { name: "Zucker", synonyms: ["Saccharose", "Zuckerarten"], group: "Zucker & Süßungsmittel", concern: "BEDENKLICH", short: "Zugesetzter Zucker dient vor allem Geschmack und Optik – ernährungsphysiologisch ist er für Hund und Katze überflüssig.", assessment: "Unnötige Energiequelle, kann Übergewicht und Zahnproblemen Vorschub leisten. In einem hochwertigen Futter hat zugesetzter Zucker nichts verloren." },
  { name: "Karamell", synonyms: ["Zuckercouleur", "Karamellzucker"], group: "Zucker & Süßungsmittel", concern: "BEDENKLICH", short: "Gebräunter Zucker, meist zur Farbgebung eingesetzt – die Farbe richtet sich an den Menschen, nicht an das Tier.", assessment: "Kein Nutzen für das Tier. Zeigt, dass beim Produkt Optik vor Ernährung steht." },
  { name: "Tierische Nebenerzeugnisse", synonyms: ["tierische Nebenprodukte"], group: "Rohstoff", concern: "EINGESCHRAENKT", short: "Sammelbegriff für Schlachtnebenprodukte wie Innereien, Blut, Knorpel oder Federn – von wertvoll bis minderwertig.", assessment: "Innereien können sehr hochwertig sein. Problematisch ist die fehlende Transparenz: Der Begriff verrät nicht, was tatsächlich enthalten ist." },
  { name: "Getreide", synonyms: [], group: "Rohstoff", concern: "EINGESCHRAENKT", short: "Sammelbezeichnung für Getreidearten wie Weizen, Mais oder Gerste ohne genaue Angabe.", assessment: "Getreide ist für viele Hunde gut verträglich. Die Sammelbezeichnung erlaubt jedoch wechselnde Rezepturen; bei Katzen sollte der Anteil gering sein." },
  { name: "Erbsenprotein", synonyms: ["Erbseneiweiß"], group: "Rohstoff", concern: "EINGESCHRAENKT", short: "Pflanzliches Protein aus Erbsen, häufig in getreidefreiem Futter, um den Proteingehalt zu erhöhen.", assessment: "Hebt den Rohproteinwert ohne zusätzliches Fleisch. Ein möglicher Zusammenhang hülsenfruchtreicher Rationen mit Herzerkrankungen bei Hunden wird diskutiert, ist aber nicht abschließend geklärt." },
  { name: "Lachsöl", synonyms: ["Fischöl"], group: "Rohstoff", concern: "UNBEDENKLICH", short: "Reich an den Omega-3-Fettsäuren EPA und DHA.", assessment: "Wertvolle Ergänzung für Haut, Fell und Gelenke – sofern frisch und ausreichend stabilisiert." },
  { name: "BHA", synonyms: ["E 320", "Butylhydroxyanisol"], group: "Konservierungsstoff", concern: "BEDENKLICH", short: "Synthetisches Antioxidationsmittel, das Fette vor dem Ranzigwerden schützt.", assessment: "Zugelassen, aber umstritten: Die IARC stuft BHA als „möglicherweise krebserregend“ (Gruppe 2B) ein. Natürliche Antioxidantien wie Tocopherole sind vorzuziehen." },
  { name: "BHT", synonyms: ["E 321", "Butylhydroxytoluol"], group: "Konservierungsstoff", concern: "EINGESCHRAENKT", short: "Synthetisches Antioxidationsmittel zur Fettstabilisierung.", assessment: "Zugelassen, die Datenlage ist uneinheitlich. Wir bevorzugen Futter mit natürlichen Antioxidantien." },
  { name: "Ethoxyquin", synonyms: ["E 324"], group: "Konservierungsstoff", concern: "BEDENKLICH", short: "Synthetisches Antioxidans, dessen Zulassung als Futtermittelzusatzstoff in der EU ausgesetzt ist.", assessment: "Die Zulassung wurde mit der Durchführungsverordnung (EU) 2017/962 ausgesetzt. Rückstände können jedoch über Rohstoffe wie Fischmehl eingetragen werden." },
  { name: "Bierhefe", synonyms: ["Hefe"], group: "Rohstoff", concern: "UNBEDENKLICH", short: "Liefert B-Vitamine und verbessert die Akzeptanz.", assessment: "In kleinen Mengen eine sinnvolle Zutat." },
  { name: "Mineralstoffe", synonyms: [], group: "Nährstoff", concern: "UNBEDENKLICH", short: "Sammelbegriff für Mengen- und Spurenelemente wie Calcium, Phosphor oder Zink.", assessment: "Für ein Alleinfuttermittel unverzichtbar. Entscheidend ist das richtige Verhältnis, etwa von Calcium zu Phosphor." },
  { name: "Farbstoffe", synonyms: ["Farbstoff"], group: "Zusatzstoff", concern: "BEDENKLICH", short: "Farbstoffe verändern nur die Optik des Futters – für Hund und Katze ohne jeden Nutzen.", assessment: "Überflüssiger Zusatz, der sich an den Käufer richtet. Kann bei empfindlichen Tieren Unverträglichkeiten begünstigen." },
  { name: "Süßkartoffel", synonyms: [], group: "Rohstoff", concern: "UNBEDENKLICH", short: "Gut verdauliche Kohlenhydratquelle mit Ballaststoffen und Beta-Carotin.", assessment: "Häufig in getreidefreiem Futter; in moderater Menge gut geeignet." },
];

const GLOSSAR: Array<{ term: string; synonyms?: string[]; definition: string }> = [
  { term: "Alleinfuttermittel", definition: "Futter, das bei alleiniger Fütterung den gesamten Nährstoffbedarf des Tieres decken muss." },
  { term: "Ergänzungsfuttermittel", definition: "Futter, das nur zusammen mit anderen Futtermitteln den Bedarf deckt, z. B. Snacks oder Zusätze." },
  { term: "Offene Deklaration", definition: "Angabe aller Einzelfuttermittel mit ihren genauen Anteilen in Prozent." },
  { term: "Geschlossene Deklaration", definition: "Angabe nach Kategorien (z. B. „Fleisch und tierische Nebenerzeugnisse“) ohne genaue Zusammensetzung." },
  { term: "Rohprotein", definition: "Gesamtgehalt an Eiweiß laut Analyse – sagt nichts über die Qualität der Proteinquelle aus." },
  { term: "Rohfett", definition: "Gesamtfettgehalt des Futters laut Analyse." },
  { term: "Rohasche", definition: "Mineralischer Rückstand nach dem Verbrennen einer Probe; hohe Werte können auf viel Knochenanteil hindeuten." },
  { term: "Rohfaser", definition: "Unverdaulicher Anteil pflanzlicher Zellwände; wichtig für die Darmtätigkeit." },
  { term: "Trockensubstanz", synonyms: ["Trockenmasse"], definition: "Futter ohne Wasseranteil. Erst in der Trockensubstanz lassen sich Nass- und Trockenfutter vergleichen." },
  { term: "Monoprotein", definition: "Futter mit nur einer tierischen Eiweißquelle – hilfreich bei Unverträglichkeiten und Ausschlussdiäten." },
  { term: "Analytische Bestandteile", definition: "Pflichtangaben zu Rohprotein, Rohfett, Rohfaser, Rohasche und ggf. Feuchtigkeit in Prozent." },
  { term: "Bedarfsdeckung", definition: "Maß dafür, ob ein Futter die empfohlenen Nährstoffmengen für Tierart und Lebensphase liefert." },
];

async function seedLexikonAndGlossary() {
  if ((await prisma.lexikonEntry.count()) === 0) {
    for (const e of LEXIKON) {
      await prisma.lexikonEntry.create({
        data: {
          slug: slugify(e.name), name: e.name, synonyms: e.synonyms, group: e.group, concern: e.concern,
          shortDescription: e.short, assessment: e.assessment,
          bodyHtml: `<p>${esc(e.short)}</p><h2>Einschätzung</h2><p>${esc(e.assessment)}</p>`,
          status: "PUBLISHED", publishedAt: new Date(),
        },
      });
    }
  }
  if ((await prisma.glossaryTerm.count()) === 0) {
    await prisma.glossaryTerm.createMany({ data: GLOSSAR.map((g) => ({ slug: slugify(g.term), term: g.term, synonyms: g.synonyms ?? [], definition: g.definition })) });
  }
}

// ---------------------------------------------------------------------------
// Demo-Produktdaten (nur für Demo-Tests, nur wenn noch leer)
// ---------------------------------------------------------------------------
type Detail = { composition: string; analysis: Array<[string, number]>; pkg: string; price: number; perDay: number; harmfulReason?: string; claims: Array<{ claim: string; rating: "ZULAESSIG" | "FRAGWUERDIG" | "UNZULAESSIG"; reason: string; legal?: string }> };

const WET = (meat: string, extra: string): Array<[string, number]> => [["Rohprotein", 10.5], ["Rohfett", 6.5], ["Rohfaser", 0.5], ["Rohasche", 2.2], ["Feuchtigkeit", 78], ...(extra ? ([[extra, 0.1]] as Array<[string, number]>) : [])].filter(([n]) => n !== meat) as Array<[string, number]>;
const DRY: Array<[string, number]> = [["Rohprotein", 26], ["Rohfett", 15], ["Rohfaser", 3], ["Rohasche", 7], ["Feuchtigkeit", 9]];

const DETAILS: Record<string, Detail> = {
  "Hofgrün Rind & Pastinake": { composition: "Rind (65 %: Muskelfleisch, Herz, Leber), Rinderbrühe (20 %), Pastinake (10 %), Leinöl, Mineralstoffe", analysis: WET("", ""), pkg: "400 g", price: 3.9, perDay: 2.45, claims: [{ claim: "getreidefrei", rating: "ZULAESSIG", reason: "Die Zusammensetzung enthält kein Getreide." }, { claim: "Monoprotein", rating: "ZULAESSIG", reason: "Rind ist die einzige tierische Proteinquelle." }] },
  "Nordrudel Lachs Adult Trocken": { composition: "Lachs (28 %, getrocknet), Erbsen, Erbsenprotein, Süßkartoffel, Lachsöl (4 %), Bierhefe, Mineralstoffe", analysis: DRY, pkg: "2 kg", price: 12.8, perDay: 1.05, claims: [{ claim: "100 % natürlich", rating: "FRAGWUERDIG", reason: "Der Begriff „natürlich“ ist nicht geschützt; zugesetzte Vitamine und Spurenelemente sind synthetischer Herkunft." }, { claim: "getreidefrei", rating: "ZULAESSIG", reason: "Kein Getreide in der Zusammensetzung." }] },
  "Bellwerk Classic Mix Huhn": { composition: "Getreide, Fleisch und tierische Nebenerzeugnisse (4 % Huhn), pflanzliche Eiweißextrakte, Zucker, Mineralstoffe, Farbstoffe, BHA", analysis: [["Rohprotein", 21], ["Rohfett", 8], ["Rohfaser", 2.5], ["Rohasche", 7.5], ["Feuchtigkeit", 10]], pkg: "4 kg", price: 8.4, perDay: 0.35, harmfulReason: "Enthält zugesetzten Zucker, Farbstoffe und das synthetische Antioxidans BHA.", claims: [{ claim: "mit Huhn", rating: "FRAGWUERDIG", reason: "Nur 4 % Huhn – die Aufmachung suggeriert einen deutlich höheren Fleischanteil.", legal: "VO (EG) 767/2009 Art. 11 Abs. 1" }, { claim: "stärkt das Immunsystem", rating: "UNZULAESSIG", reason: "Ein krankheitsbezogenes Versprechen ohne Beleg; Futtermittel dürfen nicht mit der Verhütung oder Heilung von Krankheiten werben.", legal: "VO (EG) 767/2009 Art. 13 Abs. 3" }] },
  "Feldtafel Senior Pute & Kürbis": { composition: "Pute (55 %), Putenbrühe (25 %), Kürbis (12 %), Reis (5 %), Lachsöl, Mineralstoffe", analysis: WET("", ""), pkg: "400 g", price: 2.75, perDay: 1.9, claims: [{ claim: "für Senioren", rating: "ZULAESSIG", reason: "Moderater Phosphorgehalt und angepasste Energiedichte sind nachvollziehbar." }] },
  "Samtkralle Huhn pur in Brühe": { composition: "Huhn (70 %), Hühnerbrühe (29 %), Mineralstoffe, Taurin", analysis: [["Rohprotein", 13], ["Rohfett", 4.5], ["Rohfaser", 0.3], ["Rohasche", 1.8], ["Feuchtigkeit", 80]], pkg: "200 g", price: 2.5, perDay: 1.25, claims: [{ claim: "Human Grade", rating: "FRAGWUERDIG", reason: "Der Begriff ist rechtlich nicht definiert; ein Nachweis über die Lebensmitteltauglichkeit aller Rohstoffe liegt uns nicht vor." }] },
  "Katzenkontor Indoor Trocken": { composition: "Getreide, Geflügelprotein (getrocknet, 18 %), tierische Nebenerzeugnisse, Erbsenprotein, Bierhefe, Mineralstoffe, Taurin, BHT", analysis: [["Rohprotein", 32], ["Rohfett", 12], ["Rohfaser", 4], ["Rohasche", 7], ["Feuchtigkeit", 8]], pkg: "1,5 kg", price: 12.3, perDay: 0.45, claims: [{ claim: "reduziert Haarballen", rating: "FRAGWUERDIG", reason: "Der Rohfaseranteil ist leicht erhöht; eine Wirkung ist plausibel, aber nicht belegt." }] },
  "Miaurant Gourmet Fisch-Cocktail": { composition: "Fleisch und tierische Nebenerzeugnisse, Fisch und Fischnebenerzeugnisse (4 % Fisch), Getreide, Zucker, Karamell, Mineralstoffe, Taurin", analysis: [["Rohprotein", 8.5], ["Rohfett", 4], ["Rohfaser", 0.4], ["Rohasche", 2.4], ["Feuchtigkeit", 82]], pkg: "85 g", price: 0.37, perDay: 0.95, harmfulReason: "Enthält zugesetzten Zucker und Karamell – beides ist für Katzen überflüssig.", claims: [{ claim: "Gourmet", rating: "FRAGWUERDIG", reason: "Die Rezeptur mit nur 4 % Fisch rechtfertigt die Premium-Aufmachung aus unserer Sicht nicht." }, { claim: "Fisch-Cocktail mit Lachs", rating: "UNZULAESSIG", reason: "Lachs wird auf der Schauseite hervorgehoben, in der Zusammensetzung aber nicht mit Prozentanteil genannt.", legal: "VO (EG) 767/2009 Art. 11 Abs. 1, Art. 17 Abs. 1 lit. e" }] },
  "Hofgrün Kauwurzel Ziege": { composition: "Ziegenhaut (100 %, getrocknet)", analysis: [["Rohprotein", 78], ["Rohfett", 3], ["Rohfaser", 0.5], ["Rohasche", 2], ["Feuchtigkeit", 12]], pkg: "250 g", price: 6, perDay: 0.6, claims: [{ claim: "nur eine Zutat", rating: "ZULAESSIG", reason: "Die Deklaration nennt ausschließlich Ziegenhaut." }] },
  "Bellwerk Dental Sticks": { composition: "Getreide, Zucker, pflanzliche Nebenerzeugnisse, Fleisch und tierische Nebenerzeugnisse (4 %), Mineralstoffe, Farbstoffe", analysis: [["Rohprotein", 8], ["Rohfett", 1.5], ["Rohfaser", 2.5], ["Rohasche", 3], ["Feuchtigkeit", 18]], pkg: "180 g", price: 1.99, perDay: 0.28, harmfulReason: "Zucker und Farbstoffe als Zutaten – für einen Zahnpflege-Snack besonders widersprüchlich.", claims: [{ claim: "reduziert Zahnstein um 80 %", rating: "UNZULAESSIG", reason: "Uns liegt kein Beleg für die bezifferte Wirkung vor; der Zuckerzusatz widerspricht dem Zahnpflege-Versprechen.", legal: "VO (EG) 767/2009 Art. 13 Abs. 1" }, { claim: "tierärztlich empfohlen", rating: "FRAGWUERDIG", reason: "Ohne Nachweis, wer die Empfehlung ausspricht, nicht überprüfbar." }] },
  "Samtkralle Lachsöl-Paste": { composition: "Lachsöl (60 %), Malzextrakt, Hefe, Vitamin E", analysis: [["Rohprotein", 2], ["Rohfett", 62], ["Rohfaser", 0.5], ["Rohasche", 1], ["Feuchtigkeit", 20]], pkg: "100 g", price: 3.8, perDay: 0.11, claims: [{ claim: "für glänzendes Fell", rating: "ZULAESSIG", reason: "Omega-3-Fettsäuren tragen zu Haut- und Fellgesundheit bei; die Aussage ist allgemein und nicht krankheitsbezogen." }] },
  "Katzenkontor Knusper-Taler Huhn": { composition: "Getreide, Fleisch und tierische Nebenerzeugnisse (8 % Huhn), pflanzliche Eiweißextrakte, Mineralstoffe, Taurin", analysis: [["Rohprotein", 30], ["Rohfett", 14], ["Rohfaser", 2], ["Rohasche", 6], ["Feuchtigkeit", 12]], pkg: "60 g", price: 1.15, perDay: 0.1, claims: [] },
  "Nordrudel Wild & Süßkartoffel": { composition: "Wild (60 %: Hirsch, Wildschwein), Wildbrühe (18 %), Süßkartoffel (15 %), Lachsöl, Mineralstoffe", analysis: WET("", ""), pkg: "400 g", price: 4.2, perDay: 2.6, claims: [{ claim: "hypoallergen", rating: "FRAGWUERDIG", reason: "Exotische Proteinquellen senken das Allergierisiko, „hypoallergen“ ist aber kein geschützter Begriff und kein Wirkversprechen." }, { claim: "getreidefrei", rating: "ZULAESSIG", reason: "Kein Getreide enthalten." }] },
};

function demoBody(title: string, d: Detail, verdict: string) {
  return `<p><em>Hinweis: Demo-Beispieltest mit fiktiver Marke. Vor dem Livegang durch echte Tests ersetzen.</em></p>
<h2>Rohstoffqualität</h2><p>Die Zusammensetzung von ${esc(title)} lautet: ${esc(d.composition)}. Entscheidend sind Art, Herkunft und Anteil der Hauptzutaten.</p>
<h2>Schadstoffe &amp; Bedenkliches</h2><p>${esc(d.harmfulReason ?? "Wir haben keine problematischen Zusätze wie Zucker, Farbstoffe oder synthetische Antioxidantien gefunden.")}</p>
<h2>Nährstoffprofil</h2><p>Die analytischen Bestandteile bewerten wir in der Trockensubstanz, damit Nass- und Trockenfutter vergleichbar sind.</p>
<h2>Deklaration &amp; Transparenz</h2><p>Wir prüfen, ob die Deklaration nachvollziehbar ist und ob die Werbeaussagen halten, was sie versprechen. Details im Werbeaussagen-Check unten.</p>
<h2>Bedarfsdeckung</h2><p>Abgleich der Nährstoffgehalte mit dem Bedarf der Tierart und Lebensphase.</p>
<h2>Preis-Leistung</h2><p>Packung ${esc(d.pkg)} für ca. ${d.price.toFixed(2).replace(".", ",")} €, das entspricht etwa ${d.perDay.toFixed(2).replace(".", ",")} € pro Tagesration.</p>
<h2>Fazit</h2><p>${esc(verdict)}</p>`;
}

const MORE_FAQ: Array<{ sortOrder: number; question: string; answer: string }> = [
  { sortOrder: 5, question: "Was ist das beste Hundefutter?", answer: "Das eine beste Futter gibt es nicht – es hängt von Alter, Größe, Aktivität und Verträglichkeit des Hundes ab. Gutes Hundefutter hat eine nachvollziehbare Zusammensetzung mit klar benannten Fleischanteilen, kommt ohne Zucker und Farbstoffe aus und deckt den Nährstoffbedarf. In unseren Tests sehen Sie die Punktzahl je Kriterium und können Produkte direkt vergleichen." },
  { sortOrder: 6, question: "Woran erkenne ich gutes Katzenfutter?", answer: "Katzen sind Fleischfresser. Gutes Katzenfutter hat einen hohen, klar deklarierten Fleischanteil, wenig Getreide und Kohlenhydrate und liefert Taurin in ausreichender Menge. Zucker, Farbstoffe und unspezifische Sammelbegriffe sind Warnzeichen." },
  { sortOrder: 7, question: "Was ist der Unterschied zwischen Alleinfuttermittel und Ergänzungsfuttermittel?", answer: "Ein Alleinfuttermittel deckt bei alleiniger Fütterung den gesamten Nährstoffbedarf des Tieres. Ein Ergänzungsfuttermittel, etwa ein Snack, Kauartikel oder eine Paste, ergänzt die Ration nur und darf sie nicht ersetzen. Die Bezeichnung steht auf dem Etikett." },
  { sortOrder: 8, question: "Wie lese ich die Zusammensetzung auf der Verpackung?", answer: "Die Zutaten stehen in absteigender Reihenfolge nach Gewichtsanteil. Eine offene Deklaration nennt jede Zutat mit Prozentangabe, eine geschlossene nur Kategorien wie „Fleisch und tierische Nebenerzeugnisse“. Je genauer die Angaben, desto besser lässt sich das Futter beurteilen." },
  { sortOrder: 9, question: "Warum rechnet ihr in der Trockensubstanz?", answer: "Nassfutter enthält oft rund 80 % Wasser, Trockenfutter etwa 10 %. Nur umgerechnet auf die Trockensubstanz lassen sich Rohprotein, Rohfett und Rohasche zwischen beiden fair vergleichen. Dafür nutzen wir die angegebene Feuchtigkeit." },
  { sortOrder: 10, question: "Ist getreidefreies Futter automatisch besser?", answer: "Nein. Getreide ist für viele Hunde gut verträglich. Entscheidend sind Qualität und Anteil der Zutaten insgesamt. Getreidefreie Rezepte ersetzen Getreide oft durch Hülsenfrüchte oder Kartoffeln, was nicht automatisch hochwertiger ist." },
  { sortOrder: 11, question: "Wie prüft ihr Werbeaussagen der Hersteller?", answer: "Wir prüfen Aussagen auf Verpackung und im Shop auf Zulässigkeit und Richtigkeit, unter anderem nach der VO (EG) 767/2009 und dem UWG. Unsere Einstufung ist eine begründete fachliche Einschätzung und steht im Werbeaussagen-Check jedes Tests." },
  { sortOrder: 0, question: "Warum sollte jeder Hundehalter prüfen, was er seinem Hund füttert?", answer: "Das Futter ist die wichtigste tägliche Entscheidung für die Gesundheit des Hundes: Hunde fressen über Jahre jeden Tag dasselbe, und Qualität, Nährstoffgehalt und Zusatzstoffe wirken sich auf Verdauung, Haut und Fell, Gewicht und langfristig auch auf Gelenke und Organe aus. Auf der Verpackung steht außerdem vor allem Werbung: Begriffe wie „natürlich“, „Gourmet“ oder „getreidefrei“ sind rechtlich kaum geschützt und sagen wenig über die Qualität aus. Wer die Zusammensetzung versteht, erkennt Zucker, Farbstoffe, unklare Sammelbegriffe und einen zu geringen Fleischanteil und kann Preis und Leistung fair vergleichen. Ein teures Futter ist nicht automatisch gut, ein günstiges nicht automatisch schlecht – das zeigt erst der Blick auf Deklaration und Inhaltsstoffe. Unsere Tests nehmen Ihnen diese Prüfung ab und zeigen transparent, wie jede Note entsteht. Bei Erkrankungen oder besonderen Bedürfnissen ersetzt das keine tierärztliche Beratung." },
  { sortOrder: 12, question: "Welche Zusatzstoffe sollte ich im Futter meiden?", answer: "Zugesetzter Zucker, Karamell und Farbstoffe haben für Hund und Katze keinen Nutzen. Bei synthetischen Antioxidantien wie BHA, BHT oder Ethoxyquin bevorzugen wir Futter mit natürlichen Alternativen. Jeden Inhaltsstoff ordnen wir im Futter-Lexikon mit einer Ampel ein." },
];

/** FAQ-Einträge ergänzen, ohne vorhandene zu überschreiben (Abgleich über die Frage) – idempotent. */
/** Fachblog-Beiträge aus der Nischenanalyse: nur anlegen, wenn der Slug fehlt (Admin-Änderungen bleiben erhalten). */
async function ensureNischenPosts() {
  let n = 0;
  for (const p of [...NISCHEN_POSTS, ...RECHERCHE_POSTS, ...ULMENRINDE_POSTS, ...HERSTELLER_POSTS, ...WERBUNG_POSTS, ...DENTAL_POSTS]) {
    if (await prisma.blogPost.findUnique({ where: { slug: p.slug }, select: { id: true } })) continue;
    const file = path.join(process.cwd(), "public", "blog", p.image);
    const blur = await sharp(file).resize(16).webp({ quality: 40 }).toBuffer().catch(() => null);
    if (!blur) { console.log(`Fachblog-Beitrag ${p.slug} übersprungen: Titelbild public/blog/${p.image} fehlt.`); continue; }
    await prisma.blogPost.create({
      data: {
        slug: p.slug, title: p.title, excerpt: p.excerpt,
        bodyHtml: autolinkUrls(p.bodyHtml.trim()),
        imageUrl: `/blog/${p.image}`, imageAlt: p.imageAlt,
        imageBlur: `data:image/webp;base64,${blur.toString("base64")}`,
        metaTitle: p.metaTitle, metaDescription: p.metaDescription, keywords: p.keywords,
        status: "PUBLISHED", publishedAt: new Date(Date.now() - p.daysAgo * 86400000 - 60000),
      },
    });
    n++;
  }
  if (n) console.log(`${n} Fachblog-Beiträge angelegt.`);
}

/** Fügt den Abschnitt „Anwenderstimmen“ einmalig vor dem Darm-Tagebuch in den Ulmenrinden-Ratgeber ein (idempotent über die Anker-ID). */
async function ensureUlmenrindeAnwender() {
  const post = await prisma.blogPost.findUnique({ where: { slug: "ulmenrinde-hund-darmgesundheit" }, select: { id: true, bodyHtml: true } });
  if (!post || post.bodyHtml.includes(ULMENRINDE_ANWENDER_MARKER)) return;
  const at = post.bodyHtml.search(/<h2[^>]*>\s*Ihr Darm-Tagebuch/);
  if (at < 0) return;
  const bodyHtml = autolinkUrls(post.bodyHtml.slice(0, at) + ULMENRINDE_ANWENDER_HTML + "\n" + post.bodyHtml.slice(at));
  await prisma.blogPost.update({ where: { id: post.id }, data: { bodyHtml } });
  console.log("Ulmenrinden-Ratgeber: Anwenderstimmen ergänzt.");
}

/** Fügt die Bilder aus blog-bilder.ts einmalig nach der n-ten H2 ein (idempotent über den Bildpfad). */
async function ensureBlogBodyImages() {
  const bySlug = new Map<string, typeof BLOG_BODY_IMAGES>();
  for (const b of BLOG_BODY_IMAGES) bySlug.set(b.slug, [...(bySlug.get(b.slug) ?? []), b]);
  let n = 0;
  for (const [slug, images] of bySlug) {
    const post = await prisma.blogPost.findUnique({ where: { slug }, select: { id: true, bodyHtml: true } });
    if (!post) continue;
    let html = post.bodyHtml;
    for (const img of images) {
      const src = `/blog/${img.file}`;
      if (html.includes(src)) continue;
      const ends = [...html.matchAll(/<h2[^>]*>[\s\S]*?<\/h2>/g)].map((m) => m.index! + m[0].length);
      const at = ends[img.afterH2 - 1];
      if (at === undefined) { console.log(`Blogbild ${img.file} übersprungen: ${slug} hat keine ${img.afterH2}. Überschrift.`); continue; }
      const figure = `<figure><img src="${src}" alt="${esc(img.alt).replace(/"/g, "&quot;")}" width="1200" height="675" loading="lazy"></figure>`;
      html = html.slice(0, at) + figure + html.slice(at);
    }
    if (html !== post.bodyHtml) { await prisma.blogPost.update({ where: { id: post.id }, data: { bodyHtml: html } }); n++; }
  }
  if (n) console.log(`Bilder in ${n} Blogbeiträgen ergänzt.`);
}

/** Setzt die Teaser der Test-Karten, aber nur dort, wo im Admin noch keiner steht. */
async function ensureReviewTeasers() {
  let n = 0;
  for (const [slug, teaser] of Object.entries(REVIEW_TEASERS)) {
    const r = await prisma.review.updateMany({ where: { slug, teaser: { in: ["", ...(REVIEW_TEASERS_PREVIOUS[slug] ? [REVIEW_TEASERS_PREVIOUS[slug]] : [])] } }, data: { teaser } });
    n += r.count;
  }
  if (n) console.log(`${n} Test-Teaser gesetzt.`);
}

/** Legt den Test „Medidog Ulmenrinden Paste“ an, falls der Slug fehlt (Bilder liegen in public/tests). */
/** mammaly-Tests: nur anlegen, wenn der Slug fehlt (Admin-Änderungen bleiben erhalten). */
async function ensureMammalyTests() {
  const categories = new Map((await prisma.category.findMany({ select: { id: true, slug: true } })).map((c) => [c.slug, c.id]));
  const blur = async (file: string) => {
    const b = await sharp(path.join(process.cwd(), "public", "tests", file)).resize(16).webp({ quality: 40 }).toBuffer().catch(() => null);
    return b ? `data:image/webp;base64,${b.toString("base64")}` : null;
  };
  let n = 0;
  for (const t of [...MAMMALY_TESTS, ...BUGBELL_TESTS, ...BETTERCAT_TESTS, ...WOLFSBLUT_TESTS]) {
    const category = { id: categories.get(t.categorySlug) };
    if (!category.id) { console.log(`Test ${t.slug} übersprungen: Kategorie ${t.categorySlug} fehlt.`); continue; }
    const existing = await prisma.review.findUnique({ where: { slug: t.slug }, select: { id: true, bodyHtml: true } });
    if (existing) {
      // Überarbeitete (strengere) Wertung einspielen, solange die Kennung der Neufassung im Text fehlt; spätere Admin-Änderungen bleiben unberührt.
      if (!existing.bodyHtml.includes("Strenge Wertung")) {
        const sc2 = t.scores;
        await prisma.review.update({
          where: { id: existing.id },
          data: {
            title: t.title, ...sc2, totalScore: Object.values(sc2).reduce((a, b) => a + b, 0),
            verdict: t.verdict, teaser: t.teaser, pros: t.pros, cons: t.cons, claims: t.claims,
            bodyHtml: autolinkUrls(t.bodyHtml), conclusionHtml: t.conclusionHtml,
            metaTitle: t.metaTitle, metaDescription: t.metaDescription,
          },
        });
        console.log(`Test ${t.slug}: strengere Wertung eingespielt.`);
      }
      continue;
    }
    const [imageBlur, contentImageBlur] = await Promise.all([blur(t.image), blur(t.contentImage)]);
    if (!imageBlur || !contentImageBlur) { console.log(`Test ${t.slug} übersprungen: Bilder in public/tests fehlen.`); continue; }
    const sc = t.scores;
    const published = new Date(Date.now() - t.publishedDaysAgo * 86400000);
    await prisma.review.create({
      data: {
        slug: t.slug, title: t.title, brand: t.brand, productName: t.productName, keyword: t.keyword, categoryId: category.id,
        priceClass: t.priceClass, pricePerKg: t.pricePerKg, packageSize: t.packageSize, price: t.price, pricePerDay: t.pricePerDay,
        imageUrl: `/tests/${t.image}`, imageAlt: t.imageAlt, imageBlur,
        contentImageUrl: `/tests/${t.contentImage}`, contentImageAlt: t.contentImageAlt, contentImageBlur,
        gallery: t.gallery,
        composition: t.composition, analysis: t.analysis, claims: t.claims,
        ...sc, totalScore: Object.values(sc).reduce((a, b) => a + b, 0),
        verdict: t.verdict, teaser: t.teaser, pros: t.pros, cons: t.cons,
        bodyHtml: autolinkUrls(t.bodyHtml), conclusionHtml: t.conclusionHtml,
        metaTitle: t.metaTitle, metaDescription: t.metaDescription, keywords: t.keywords,
        priceDate: new Date("2026-10-09T12:00:00Z"), testedAt: new Date(published.getTime() - 5 * 86400000),
        status: "PUBLISHED", publishedAt: published,
      },
    });
    n++;
  }
  if (n) console.log(`${n} mammaly-Tests angelegt.`);
}

/** Fügt den Abschnitt „Was Blogger und Halter berichten“ einmalig vor dem Preis-Abschnitt ein (idempotent über die Anker-ID). */
async function ensureMammalyBlogs() {
  for (const [slug, html] of Object.entries(MAMMALY_BLOG_SECTIONS)) {
    const r = await prisma.review.findUnique({ where: { slug }, select: { id: true, bodyHtml: true } });
    if (!r || r.bodyHtml.includes(MAMMALY_BLOGS_MARKER)) continue;
    const at = r.bodyHtml.search(/<h2[^>]*>\s*Preis pro Tag, Abo und Garantie/);
    if (at < 0) continue;
    await prisma.review.update({ where: { id: r.id }, data: { bodyHtml: autolinkUrls(r.bodyHtml.slice(0, at) + html + "\n\n" + r.bodyHtml.slice(at)) } });
    console.log(`Test ${slug}: Abschnitt Stimmen ergänzt.`);
  }
}

async function ensureMedidogTest() {
  const t = MEDIDOG_TEST;
  const existing = await prisma.review.findUnique({ where: { slug: t.slug }, select: { id: true, bodyHtml: true } });
  if (existing) {
    // Erste Fassung noch unverändert im Text? Dann Inhalte aktualisieren; Admin-Änderungen bleiben sonst unberührt.
    if (existing.bodyHtml.includes(MEDIDOG_V1_SIGNATURE)) {
      await prisma.review.update({ where: { id: existing.id }, data: { bodyHtml: autolinkUrls(t.bodyHtml), conclusionHtml: t.conclusionHtml, verdict: t.verdict, pros: t.pros, cons: t.cons, claims: t.claims } });
      console.log("Test Medidog Ulmenrinden Paste aktualisiert.");
    } else if (!existing.bodyHtml.includes("Bionic Nature")) {
      // Herstellerhinweis nachrüsten (Hersteller ja, Marke bleibt Medidog); Admin-Änderungen am Rest bleiben erhalten.
      const from = "<p>Auf dem Etikett stehen";
      if (existing.bodyHtml.includes(from)) {
        await prisma.review.update({ where: { id: existing.id }, data: { bodyHtml: existing.bodyHtml.replace(from, "<p>Hersteller der Paste ist die Bionic Nature GmbH; Medidog ist die Marke, unter der sie vertrieben wird. Auf dem Etikett stehen") } });
        console.log("Test Medidog: Herstellerhinweis ergänzt.");
      }
    }
    return;
  }
  const category = await prisma.category.findUnique({ where: { slug: t.categorySlug }, select: { id: true } });
  if (!category) return;
  const blur = async (file: string) => {
    const b = await sharp(path.join(process.cwd(), "public", "tests", file)).resize(16).webp({ quality: 40 }).toBuffer().catch(() => null);
    return b ? `data:image/webp;base64,${b.toString("base64")}` : null;
  };
  const [imageBlur, contentImageBlur] = await Promise.all([blur(t.image), blur(t.contentImage)]);
  if (!imageBlur || !contentImageBlur) { console.log("Test Medidog übersprungen: Bilder in public/tests fehlen."); return; }
  const sc = t.scores;
  await prisma.review.create({
    data: {
      slug: t.slug, title: t.title, brand: t.brand, productName: t.productName, keyword: t.keyword, categoryId: category.id,
      priceClass: t.priceClass, pricePerKg: t.pricePerKg, packageSize: t.packageSize, price: t.price, pricePerDay: t.pricePerDay,
      imageUrl: `/tests/${t.image}`, imageAlt: t.imageAlt, imageBlur,
      contentImageUrl: `/tests/${t.contentImage}`, contentImageAlt: t.contentImageAlt, contentImageBlur,
      gallery: t.gallery.map((g) => `/tests/${g}`),
      composition: t.composition, analysis: t.analysis, claims: t.claims,
      ...sc, totalScore: Object.values(sc).reduce((a, b) => a + b, 0),
      verdict: t.verdict, teaser: t.teaser, pros: t.pros, cons: t.cons,
      bodyHtml: autolinkUrls(t.bodyHtml), conclusionHtml: t.conclusionHtml,
      metaTitle: t.metaTitle, metaDescription: t.metaDescription, keywords: t.keywords,
      priceDate: new Date("2026-10-09T12:00:00Z"), testedAt: new Date("2026-10-09T12:00:00Z"),
      status: "PUBLISHED", publishedAt: new Date(),
    },
  });
  console.log("Test Medidog Ulmenrinden Paste angelegt.");
}

async function ensureFaq() {
  let n = 0;
  for (const f of MORE_FAQ) {
    if (await prisma.faqItem.findFirst({ where: { question: f.question }, select: { id: true } })) continue;
    await prisma.faqItem.create({ data: f });
    n++;
  }
  if (n) console.log(`FAQ ergänzt: ${n}`);
}

/** Lange Text-URLs in gespeicherten Texten (z. B. Quellen) einmalig in kurze Links umwandeln – idempotent. */
async function normalizeStoredLinks() {
  let n = 0;
  for (const r of await prisma.review.findMany({ where: { bodyHtml: { contains: "http" } }, select: { id: true, bodyHtml: true } })) {
    const next = autolinkUrls(r.bodyHtml);
    if (next !== r.bodyHtml) { await prisma.review.update({ where: { id: r.id }, data: { bodyHtml: next } }); n++; }
  }
  for (const r of await prisma.blogPost.findMany({ where: { bodyHtml: { contains: "http" } }, select: { id: true, bodyHtml: true } })) {
    const next = autolinkUrls(r.bodyHtml);
    if (next !== r.bodyHtml) { await prisma.blogPost.update({ where: { id: r.id }, data: { bodyHtml: next } }); n++; }
  }
  for (const r of await prisma.lexikonEntry.findMany({ where: { bodyHtml: { contains: "http" } }, select: { id: true, bodyHtml: true } })) {
    const next = autolinkUrls(r.bodyHtml);
    if (next !== r.bodyHtml) { await prisma.lexikonEntry.update({ where: { id: r.id }, data: { bodyHtml: next } }); n++; }
  }
  if (n) console.log(`Links gekürzt in ${n} Texten.`);
}

/** Bild 2 (Futter selbst) für Demo-Tests nachrüsten, die noch keins haben. */
async function ensureDemoContentImages() {
  const byTitle = new Map(DEMOS.map((d) => [`${d.brand} ${d.product}`, d]));
  const rows = await prisma.review.findMany({ where: { contentImageUrl: null, title: { in: [...byTitle.keys()] } }, select: { id: true, slug: true, title: true } });
  for (const r of rows) {
    const d = byTitle.get(r.title)!;
    const img = await demoContentImage(`${r.slug}-inhalt.webp`, formFor(d), d.hue);
    await prisma.review.update({ where: { id: r.id }, data: { contentImageUrl: img.url, contentImageBlur: img.blur, contentImageAlt: `Inhalt von ${r.title} ohne Verpackung: ${img.label}` } });
  }
  if (rows.length) console.log(`Demo-Inhaltsbilder ergänzt: ${rows.length}`);
}

async function ensureDemoDetails() {
  const demos = await prisma.review.findMany({ where: { composition: "", title: { in: Object.keys(DETAILS) } }, select: { id: true, title: true, verdict: true, publishedAt: true } });
  for (const r of demos) {
    const d = DETAILS[r.title];
    await prisma.review.update({
      where: { id: r.id },
      data: {
        composition: d.composition,
        analysis: d.analysis.map(([name, value]) => ({ name, value })),
        packageSize: d.pkg,
        price: d.price,
        pricePerDay: d.perDay,
        priceDate: new Date(),
        testedAt: r.publishedAt ? new Date(r.publishedAt.getTime() - 5 * 86400000) : null,
        harmfulReason: d.harmfulReason ?? "",
        claims: d.claims.map((c) => ({ claim: c.claim, rating: c.rating, reason: c.reason, legal: c.legal ?? "", imageUrl: "" })),
        bodyHtml: demoBody(r.title, d, r.verdict),
      },
    });
  }
  if (demos.length) console.log(`Demo-Produktdaten ergänzt: ${demos.length}`);
}

main().catch((e) => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
