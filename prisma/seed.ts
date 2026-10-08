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
  { slug: "alleinfutter-hund", name: "Alleinfuttermittel für Hunde", shortName: "Alleinfutter Hund", animal: "HUND", foodType: "ALLEIN", sortOrder: 1, description: "Vollwertige Futtermittel, die den gesamten Nährstoffbedarf eines Hundes decken sollen." },
  { slug: "alleinfutter-katze", name: "Alleinfuttermittel für Katzen", shortName: "Alleinfutter Katze", animal: "KATZE", foodType: "ALLEIN", sortOrder: 2, description: "Vollwertige Futtermittel, die den gesamten Nährstoffbedarf einer Katze decken sollen." },
  { slug: "ergaenzungsfutter-hund", name: "Ergänzungsfuttermittel für Hunde", shortName: "Ergänzung Hund", animal: "HUND", foodType: "ERGAENZUNG", sortOrder: 3, description: "Snacks, Kauartikel und Zusätze, die eine Ration ergänzen – nicht ersetzen." },
  { slug: "ergaenzungsfutter-katze", name: "Ergänzungsfuttermittel für Katzen", shortName: "Ergänzung Katze", animal: "KATZE", foodType: "ERGAENZUNG", sortOrder: 4, description: "Snacks, Pasten und Zusätze, die eine Ration für Katzen ergänzen." },
] as const;

type Demo = {
  brand: string; product: string; cat: (typeof CATEGORIES)[number]["slug"]; keyword: string; price: "GUENSTIG" | "MITTEL" | "PREMIUM"; perKg: number;
  s: [number, number, number, number, number, number]; verdict: string; pros: string[]; cons: string[]; hue: number; daysAgo: number;
};

const DEMOS: Demo[] = [
  { brand: "Hofgrün", product: "Rind & Pastinake", cat: "alleinfutter-hund", keyword: "Nassfutter, Monoprotein", price: "PREMIUM", perKg: 9.8, s: [27, 19, 18, 14, 9, 3], verdict: "Hochwertige, klar deklarierte Rezeptur mit einer tierischen Proteinquelle. Ideal auch für empfindliche Hunde.", pros: ["Offene Deklaration mit Prozentangaben", "Eine einzige tierische Proteinquelle", "Keine Zucker- oder Aromazusätze"], cons: ["Hoher Preis pro Kilogramm", "Jodgehalt am unteren Rand"], hue: 150, daysAgo: 2 },
  { brand: "Nordrudel", product: "Lachs Adult Trocken", cat: "alleinfutter-hund", keyword: "Trockenfutter, getreidefrei", price: "MITTEL", perKg: 6.4, s: [22, 17, 16, 11, 8, 4], verdict: "Solides Trockenfutter mit gutem Fettsäureprofil, die Erbsenanteile drücken jedoch die Rohstoffnote.", pros: ["Gutes Omega-3-Profil", "Faires Preis-Leistungs-Verhältnis"], cons: ["Hoher Anteil Hülsenfrüchte", "Werbeaussage „natürlich“ unscharf"], hue: 200, daysAgo: 6 },
  { brand: "Bellwerk", product: "Classic Mix Huhn", cat: "alleinfutter-hund", keyword: "Trockenfutter, Discount", price: "GUENSTIG", perKg: 2.1, s: [9, 7, 12, 5, 6, 4], verdict: "Günstig, aber mit unklarer Deklaration und Zuckerzusatz. Für die tägliche Fütterung nicht empfehlenswert.", pros: ["Sehr niedriger Preis", "Bedarfsdeckende Vitaminierung"], cons: ["Zucker und Farbstoffe zugesetzt", "Sammelbezeichnungen statt klarer Rohstoffe", "Hoher Getreideanteil"], hue: 20, daysAgo: 11 },
  { brand: "Feldtafel", product: "Senior Pute & Kürbis", cat: "alleinfutter-hund", keyword: "Nassfutter, Senior", price: "MITTEL", perKg: 6.9, s: [24, 18, 17, 13, 9, 4], verdict: "Gut verträgliche Senior-Rezeptur mit angepasstem Phosphorgehalt und sauberer Deklaration.", pros: ["Moderater Phosphorgehalt", "Transparente Zusammensetzung"], cons: ["Kleine Dosen erzeugen viel Verpackungsmüll"], hue: 35, daysAgo: 15 },
  { brand: "Samtkralle", product: "Huhn pur in Brühe", cat: "alleinfutter-katze", keyword: "Nassfutter, Monoprotein", price: "PREMIUM", perKg: 12.5, s: [28, 19, 18, 14, 9, 2], verdict: "Sehr fleischbetonte Rezeptur mit hervorragender Taurinversorgung. Teuer, aber fachlich überzeugend.", pros: ["Hoher Fleischanteil", "Taurin bedarfsgerecht ergänzt", "Keine pflanzlichen Füllstoffe"], cons: ["Sehr hoher Preis"], hue: 280, daysAgo: 3 },
  { brand: "Katzenkontor", product: "Indoor Trocken", cat: "alleinfutter-katze", keyword: "Trockenfutter, Wohnungskatze", price: "MITTEL", perKg: 8.2, s: [16, 15, 14, 9, 6, 3], verdict: "Akzeptabel, aber der hohe Kohlenhydratanteil passt nicht zum Bedarf einer reinen Fleischfresserin.", pros: ["Gute Akzeptanz", "Bedarfsdeckende Mineralisierung"], cons: ["Hoher Kohlenhydratanteil", "Tierische Nebenerzeugnisse nicht spezifiziert"], hue: 260, daysAgo: 9 },
  { brand: "Miaurant", product: "Gourmet Fisch-Cocktail", cat: "alleinfutter-katze", keyword: "Nassfutter, Fisch", price: "GUENSTIG", perKg: 4.3, s: [12, 8, 13, 6, 6, 4], verdict: "Aromatisiert und mit Zucker versetzt – die Schadstoffkategorie fällt durch. Nicht für die Dauerfütterung.", pros: ["Günstig", "Hohe Akzeptanz"], cons: ["Zuckerzusatz", "Nur 4 % deklarierter Fisch", "Irreführende „Gourmet“-Aufmachung"], hue: 190, daysAgo: 13 },
  { brand: "Hofgrün", product: "Kauwurzel Ziege", cat: "ergaenzungsfutter-hund", keyword: "Kausnack, Monoprotein", price: "MITTEL", perKg: 24.0, s: [26, 19, 15, 13, 8, 3], verdict: "Naturbelassener Kausnack mit einer einzigen Zutat. Gut geeignet für Allergiker.", pros: ["Nur eine Zutat", "Lange Kaudauer"], cons: ["Starker Eigengeruch"], hue: 90, daysAgo: 5 },
  { brand: "Bellwerk", product: "Dental Sticks", cat: "ergaenzungsfutter-hund", keyword: "Zahnpflege-Snack", price: "GUENSTIG", perKg: 11.0, s: [10, 9, 10, 6, 5, 3], verdict: "Hoher Zucker- und Stärkeanteil, der Zahnpflege-Nutzen ist nicht belegt.", pros: ["Gut dosierbar"], cons: ["Zucker als Zutat", "Werbeversprechen nicht belegt", "Viele Zusatzstoffe"], hue: 10, daysAgo: 18 },
  { brand: "Samtkralle", product: "Lachsöl-Paste", cat: "ergaenzungsfutter-katze", keyword: "Paste, Omega-3", price: "MITTEL", perKg: 38.0, s: [23, 18, 17, 12, 8, 3], verdict: "Sinnvolle Ergänzung zur Omega-3-Versorgung mit klarer Dosierempfehlung.", pros: ["Klare Dosierung", "Hoher EPA/DHA-Gehalt"], cons: ["Malzextrakt als Geschmacksträger"], hue: 330, daysAgo: 8 },
  { brand: "Katzenkontor", product: "Knusper-Taler Huhn", cat: "ergaenzungsfutter-katze", keyword: "Leckerli", price: "GUENSTIG", perKg: 19.0, s: [14, 12, 11, 8, 6, 3], verdict: "Als gelegentliches Leckerli vertretbar, der Getreideanteil ist jedoch hoch.", pros: ["Kleine Stückgröße", "Ohne Farbstoffe"], cons: ["Hoher Getreideanteil", "Fleischanteil unklar"], hue: 45, daysAgo: 20 },
  { brand: "Nordrudel", product: "Wild & Süßkartoffel", cat: "alleinfutter-hund", keyword: "Nassfutter, Allergiker", price: "PREMIUM", perKg: 10.5, s: [26, 20, 18, 14, 9, 3], verdict: "Hervorragende Hypoallergen-Option mit exotischer Proteinquelle und tadelloser Deklaration.", pros: ["Exotische Proteinquelle", "Keine bedenklichen Zusätze", "Vollständig offene Deklaration"], cons: ["Hoher Preis"], hue: 120, daysAgo: 1 },
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

  if ((await prisma.review.count()) > 0) {
    console.log("Inhalte vorhanden – Demo-Inhalte übersprungen.");
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
        bodyHtml: `${DEMO_NOTE}<h2>Zusammensetzung</h2><p>${title} wurde anhand der deklarierten Zusammensetzung, der analytischen Bestandteile und der Zusatzstoffe bewertet.</p><h2>Rohstoffe im Detail</h2><p>${d.verdict}</p><h3>Analytische Bestandteile</h3><table><thead><tr><th scope="col">Bestandteil</th><th scope="col">Gehalt</th></tr></thead><tbody><tr><td>Rohprotein</td><td>${(9 + (i % 5) * 2).toFixed(1)} %</td></tr><tr><td>Rohfett</td><td>${(5 + (i % 4)).toFixed(1)} %</td></tr><tr><td>Rohasche</td><td>${(1.8 + (i % 3) * 0.3).toFixed(1)} %</td></tr></tbody></table><h2>Fazit des Experten</h2><p>${d.verdict}</p>`,
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
    { title: "Alleinfutter oder Ergänzungsfutter – was ist der Unterschied?", excerpt: "Warum die Bezeichnung auf dem Etikett rechtlich entscheidend ist und was sie über die Bedarfsdeckung verrät.", hue: 170 },
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

  console.log(`Seed fertig: ${ids.length} Tests, ${posts.length} Blogartikel.`);
}

main().catch((e) => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
