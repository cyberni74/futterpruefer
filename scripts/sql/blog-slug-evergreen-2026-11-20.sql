-- Ergänzungsfutter-Hub 20.11.2026
-- Vorbereitung für den Go-live, NICHT ohne Freigabe und Backup-Prüfung ausführen.
-- Zweck: Blog-Slugs der Gelenk- und Lachsöl-Vergleiche auf evergreen URLs setzen
-- und Redirect-Zeilen in "Redirect" anlegen (ergänzend zu next.config.ts).
-- Nach dem Lauf: Preview/Live prüfen, bei Bedarf das Rollback unten nutzen.
-- Ausführung nur als Tabellen-Owner bzw. Service-Role (BYPASSRLS). Service-Key niemals protokollieren.
-- Optional danach (nicht zwingend, weil next.config und Aliase 301 bereits greifen):
--   UPDATE "BlogPost" SET "bodyHtml" = replace("bodyHtml", '/blog/gelenk-test-hund-oktober-2026', '/blog/gelenktabletten-hund-vergleich');
--   UPDATE "BlogPost" SET "bodyHtml" = replace("bodyHtml", '/blog/lachsoel-test-hund-oktober-2026', '/blog/lachsoel-hund-vergleich');
--   UPDATE "TickerItem" SET href = replace(href, '/blog/gelenk-test-hund-oktober-2026', '/blog/gelenktabletten-hund-vergleich') WHERE href LIKE '%gelenk-test-hund-oktober-2026%';
--   UPDATE "TickerItem" SET href = replace(href, '/blog/lachsoel-test-hund-oktober-2026', '/blog/lachsoel-hund-vergleich') WHERE href LIKE '%lachsoel-test-hund-oktober-2026%';

BEGIN;

CREATE TABLE IF NOT EXISTS "blog_post_slug_backup_20261120" (
  "id"          TEXT PRIMARY KEY,
  "oldSlug"     TEXT NOT NULL,
  "newSlug"     TEXT NOT NULL,
  "updatedAt"   TIMESTAMP(3) NOT NULL,
  "backedUpAt"  TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO "blog_post_slug_backup_20261120" ("id", "oldSlug", "newSlug", "updatedAt")
SELECT "id", "slug", 'gelenktabletten-hund-vergleich', "updatedAt"
FROM "BlogPost"
WHERE "slug" = 'gelenk-test-hund-oktober-2026'
ON CONFLICT ("id") DO NOTHING;

INSERT INTO "blog_post_slug_backup_20261120" ("id", "oldSlug", "newSlug", "updatedAt")
SELECT "id", "slug", 'lachsoel-hund-vergleich', "updatedAt"
FROM "BlogPost"
WHERE "slug" = 'lachsoel-test-hund-oktober-2026'
ON CONFLICT ("id") DO NOTHING;

-- Abbruch, wenn die Ziel-Slugs schon von anderen Beiträgen belegt sind.
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM "BlogPost"
    WHERE "slug" IN ('gelenktabletten-hund-vergleich', 'lachsoel-hund-vergleich')
  ) THEN
    RAISE EXCEPTION 'Ziel-Slug existiert bereits – Skript abgebrochen, keine Änderung.';
  END IF;
  IF (SELECT COUNT(*) FROM "BlogPost" WHERE "slug" IN ('gelenk-test-hund-oktober-2026', 'lachsoel-test-hund-oktober-2026')) < 2 THEN
    RAISE EXCEPTION 'Quell-Beiträge nicht vollständig gefunden – Skript abgebrochen.';
  END IF;
END $$;

UPDATE "BlogPost"
SET "slug" = 'gelenktabletten-hund-vergleich'
WHERE "slug" = 'gelenk-test-hund-oktober-2026';

UPDATE "BlogPost"
SET "slug" = 'lachsoel-hund-vergleich'
WHERE "slug" = 'lachsoel-test-hund-oktober-2026';

-- IDs bewusst fest (kein cuid-Generator in SQL). Ausführen als Rolleninhaber / Service-Role mit BYPASSRLS.
INSERT INTO "Redirect" ("id", "fromPath", "toPath", "createdAt")
VALUES
  ('redir_gelenk_evergreen_20261120', '/blog/gelenk-test-hund-oktober-2026', '/blog/gelenktabletten-hund-vergleich', CURRENT_TIMESTAMP),
  ('redir_lachsoel_evergreen_20261120', '/blog/lachsoel-test-hund-oktober-2026', '/blog/lachsoel-hund-vergleich', CURRENT_TIMESTAMP)
ON CONFLICT ("fromPath") DO UPDATE SET "toPath" = EXCLUDED."toPath";

COMMIT;

-- Rollback (nur nach Prüfung, nicht zusammen mit dem Lauf oben ausführen):
-- BEGIN;
-- UPDATE "BlogPost" b
-- SET "slug" = bak."oldSlug"
-- FROM "blog_post_slug_backup_20261120" bak
-- WHERE b."id" = bak."id";
-- DELETE FROM "Redirect"
-- WHERE "fromPath" IN ('/blog/gelenk-test-hund-oktober-2026', '/blog/lachsoel-test-hund-oktober-2026');
-- COMMIT;
