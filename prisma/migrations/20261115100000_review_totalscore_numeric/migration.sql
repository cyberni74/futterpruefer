-- Gesamtwertung darf eine Nachkommastelle haben (z. B. Teamwertung 91,8).
-- Ganze Zahlen bleiben in der Anzeige ganze Zahlen.
ALTER TABLE "Review" ALTER COLUMN "totalScore" TYPE DOUBLE PRECISION;
