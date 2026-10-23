// Erzeugt -400/-800-Varianten für lokale Bilder unter public/ und schreibt src/data/image-variants.json.
// Aufruf: node scripts/local-image-variants.mjs  (nach dem Hinzufügen oder Ändern eines Bildes aus LOCAL_IMAGES)
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const LOCAL_IMAGES = [
  "/brand/drei-hunde-auf-blumenwiese-hundefutter-test.webp",
  "/blog/hund-stadtwohnung-ohne-garten-alltag.webp",
  "/tests/bugbell-bellyvital-hund-kroketten-insektenprotein.webp",
  "/tests/bugbell-bellyvital-trockenfutter-hund-napf.webp",
  "/tests/medidog-ulmenrinden-paste-hund-dose.webp",
  "/tests/medidog-ulmenrinden-paste-hund-etikett-pflichtangaben.webp",
  "/tests/medidog-ulmenrinden-paste-hund-fuetterungsempfehlung.webp",
  "/tests/medidog-ulmenrinden-paste-hund-paste-in-schale.webp",
];
const WIDTHS = [400, 800];
const root = new URL("../public", import.meta.url).pathname;
const manifest = {};
for (const rel of LOCAL_IMAGES) {
  const file = path.join(root, rel);
  const meta = await sharp(file).metadata();
  const v = [];
  for (const w of WIDTHS) {
    if (w >= meta.width) continue;
    const out = rel.replace(/\.webp$/, `-${w}.webp`);
    await sharp(file).resize({ width: w }).webp({ quality: 60, effort: 6 }).toFile(path.join(root, out));
    v.push({ w, src: out });
  }
  manifest[rel] = { w: meta.width, v };
}
fs.writeFileSync(new URL("../src/data/image-variants.json", import.meta.url), `${JSON.stringify(manifest, null, 2)}\n`);
console.log(`${Object.keys(manifest).length} Bilder, ${Object.values(manifest).reduce((n, e) => n + e.v.length, 0)} Varianten`);
