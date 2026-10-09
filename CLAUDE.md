# Futterprüfer – Projektregeln

- **Veröffentlichungsdaten staffeln:** Neue Tests und Blogbeiträge nie am selben Tag/zur selben Uhrzeit wie andere veröffentlichen. `publishedAt` (bei Tests auch `testedAt`, 3–7 Tage davor) auf einen eigenen Tag mit abweichender Uhrzeit setzen, im Abstand von mehreren Tagen zu den jüngsten Einträgen; nie in der Zukunft. Gilt für Seed und direkte DB-Eingriffe. Produkt des Monats richtet sich nach dem Monat von `publishedAt`.
- Bilder für Blogbeiträge: Skill `blog-bilder`.
- „Bionic Nature GmbH“ darf bei Produkten (Tests, Herstellerangaben) genannt werden. Im Impressum, Footer und Betreiberangaben nicht.
- **Ansprache: durchgehend „Sie“/„Ihr“** (so schreibt die Seite bereits in Oberfläche, Ratgebern und Tests). Kein „du“, außer in wörtlichen Zitaten von Herstellern oder Nutzern, die als Zitat gekennzeichnet sind.
- Keine Zugangsdaten im Chat; vor Änderungen Tests ausführen (`npx vitest run`).
