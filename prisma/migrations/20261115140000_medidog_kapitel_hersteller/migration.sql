-- Entfernt nur das Kapitel „Produkt, Marke und ein Gespräch mit dem Hersteller“
-- im Test medidog-haut-und-fellglueck-paste. Die Nummern danach setzt die Vorlage neu.
UPDATE "Review"
SET
  "bodyHtml" = replace("bodyHtml", $kapitel_body$<h2>Produkt, Marke und ein Gespräch mit dem Hersteller</h2>
<p>Die Haut- &amp; Fellglück Paste kommt von MEDIDOG, einer Marke der Bionic Nature GmbH. Das steht im Footer des Herstellershops. Mehr zur Firma steht im <a href="/blog/bionic-nature-medidog-medipet-medicat">Firmenporträt Bionic Nature</a>.</p>
<p>Geprüft haben wir den Deklarationsblock und den Werbetext auf <a class="src-link" href="https://medipet-shop.de/fuer-hunde/form/power-pasten/medidog-haut-fellglueck-paste-SW10073" target="_blank" rel="noopener">medipet-shop.de</a> (15.11.2026) sowie die öffentlich sichtbaren Aussagen des Amazon-Listings zur ASIN B0F1V275Q4. Den vollständigen Amazon-Quelltext konnten wir an diesem Tag nicht laden; die Listing-Zitate stützen sich auf die öffentliche Suchindex-Fassung und eine frühere Sichtung, mit diesem Vorbehalt.</p>

$kapitel_body$, ''),
  "layoutData" = jsonb_set(
    "layoutData",
    '{kapitel}',
    (
      SELECT COALESCE(jsonb_agg(elem ORDER BY ord), '[]'::jsonb)
      FROM jsonb_array_elements("layoutData"->'kapitel') WITH ORDINALITY AS t(elem, ord)
      WHERE elem->>'id' <> 'produkt-marke-und-ein-gesprach-mit-dem-hersteller'
    )
  )
WHERE slug = 'medidog-haut-und-fellglueck-paste'
  AND EXISTS (
    SELECT 1
    FROM jsonb_array_elements("layoutData"->'kapitel') elem
    WHERE elem->>'id' = 'produkt-marke-und-ein-gesprach-mit-dem-hersteller'
  );
