---
name: blog-bilder
description: Standard-Ablauf für Titelbilder von Blogbeiträgen auf futterprüfer.de (Higgsfield erzeugen, komprimieren, SEO-gerecht benennen, einbinden). Verwenden bei jedem neuen Blogartikel oder Test ohne Titelbild.
---

# Blog-Titelbilder (immer so)

1. **Erzeugen** mit Higgsfield (`generate_image`, Modell `gpt_image_2_5`, `aspect_ratio` 16:9). Prompt auf Deutsch: fotorealistisches Editorial-Foto zum Artikelthema, natürliche Farben, **kein Text, keine Logos, keine Marken**. Ein Bild pro Artikel (ca. 0,25 Credits).
2. **Herunterladen**: Host `d8j0ntlcm91z4.cloudfront.net` muss in der Cloud-Umgebung erlaubt sein (Network access → Allowed domains). Sonst den Nutzer bitten, die Bilder als ZIP hochzuladen; Zuordnung über die Job-ID im Dateinamen.
3. **Komprimieren** mit sharp: `resize(1200, 675, { fit: "cover" })`, WebP, Qualität ~72 (Ziel unter 150 KB).
4. **SEO-Dateiname**: kleingeschrieben, Bindestriche, ohne Umlaute (ae/oe/ue/ss), Thema + Suchbegriff, z. B. `hund-maulkorb-zugfahrt-training.webp`. Kein „image1“, keine IDs.
5. **Ablage**: `public/blog/<dateiname>.webp`. Im Seed-Eintrag (`prisma/blog-nischen.ts` bzw. `blog-recherche.ts`) `image` und einen **beschreibenden Alt-Text mit Suchbegriff** setzen. Der Seed legt einen Artikel nur an, wenn die Bilddatei existiert, und berechnet das Blur-Placeholder selbst.
6. **Prüfen**: Bilder ansehen (passt zum Thema, keine Textreste, keine Verzerrungen), dann `tsc`, `eslint`, committen, mit `origin/main` mergen, pushen.

## Bilder im Fließtext
- Pro Artikel 1–2 Bilder nach der 2.–6. H2, nie bei „Das Wichtigste in Kürze", FAQ, Checkliste, Fazit oder Quellen.
- Eintrag in `prisma/blog-bilder.ts` (`slug`, `afterH2` 1-basiert, `file`, `alt`). `ensureBlogBodyImages()` im Seed fügt `<figure><img …></figure>` einmalig ein (idempotent über den Bildpfad).
- Bilddateien liegen in `public/blog/`, 1200×675 WebP, SEO-Dateiname, Alt-Text beschreibend mit Suchbegriff.
