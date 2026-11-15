-- Entfernt nur den Offenlegungs-Kasten im Test medidog-haut-und-fellglueck-paste.
-- Amazon-Hinweise an den Buttons bleiben.
UPDATE "Review"
SET
  "bodyHtml" = replace("bodyHtml", $offenlegung_body$<div class="fp-box fp-info">
<p><strong>Offenlegung</strong></p>
<p>Die Redaktion hat mit der Bionic Nature GmbH gesprochen. Angaben aus diesem Gespräch geben wir als Herstellerauskunft wieder; geprüft haben wir sie nicht. Die Redaktionsleitung hat am 5. November 2026 bestätigt, dass in den vorangegangenen zwei Jahren keine Geschäftsbeziehung zur Bionic Nature GmbH oder zur Animagus GmbH bestand und für Tests nichts bezahlt oder in Auftrag gegeben wurde.</p>
</div>

$offenlegung_body$, ''),
  "layoutData" = replace("layoutData"::text, $offenlegung_layout$<div class=\"fp-box fp-info\">\n<p><strong>Offenlegung</strong></p>\n<p>Die Redaktion hat mit der Bionic Nature GmbH gesprochen. Angaben aus diesem Gespräch geben wir als Herstellerauskunft wieder; geprüft haben wir sie nicht. Die Redaktionsleitung hat am 5. November 2026 bestätigt, dass in den vorangegangenen zwei Jahren keine Geschäftsbeziehung zur Bionic Nature GmbH oder zur Animagus GmbH bestand und für Tests nichts bezahlt oder in Auftrag gegeben wurde.</p>\n</div>\n\n$offenlegung_layout$, '')::jsonb
WHERE slug = 'medidog-haut-und-fellglueck-paste'
  AND strpos("bodyHtml", '<strong>Offenlegung</strong>') > 0;
