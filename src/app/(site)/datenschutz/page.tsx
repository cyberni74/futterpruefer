import type { Metadata } from "next";
import { PageShell } from "@/components/page-shell";
import { OPERATOR } from "@/lib/site";

export const metadata: Metadata = { title: "Datenschutzerklärung", description: "Datenschutzerklärung von Futterprüfer.de: Verantwortlicher, Hosting, Reichweitenmessung ohne Cookies, Kontaktformular, Newsletter und Ihre Rechte.", alternates: { canonical: "/datenschutz" } };

export default function DatenschutzPage() {
  return (
    <PageShell crumb="Datenschutz" path="/datenschutz" title="Datenschutzerklärung">
      <div className="prose-fp">
        <h2>1. Verantwortlicher</h2>
        <p>
          {OPERATOR.name}<br />
          {OPERATOR.address.join(", ")}<br />
          E-Mail: <a href={`mailto:${OPERATOR.email}`}>{OPERATOR.email}</a><br />
          Telefon: {OPERATOR.phone}
        </p>
        <p>Vertreter in der Europäischen Union nach Art. 27 DSGVO: {OPERATOR.europeRepresentative}{OPERATOR.europeAddress ? `, ${OPERATOR.europeAddress}` : ""}, E-Mail: {OPERATOR.email}</p>
        <h2>2. Hosting und Datenbank</h2>
        <p>Diese Website wird bei Vercel Inc. (USA) gehostet, die Server-Funktionen laufen in der Region Frankfurt. Beim Aufruf werden technisch notwendige Daten (IP-Adresse, Zeitpunkt, aufgerufene Seite, Browser) verarbeitet (Art. 6 Abs. 1 lit. f DSGVO). Die Übermittlung in die USA erfolgt auf Grundlage des EU-US Data Privacy Framework bzw. von EU-Standardvertragsklauseln. Mit Vercel besteht eine Vereinbarung zur Auftragsverarbeitung (Art. 28 DSGVO) (Data Processing Addendum, Bestandteil der Vercel-Nutzungsbedingungen).</p>
        <p>Die Inhalte der Website und Kontaktanfragen werden in einer Datenbank von Supabase (Rechenzentrum in Frankfurt am Main, Deutschland) gespeichert. Mit Supabase besteht eine Vereinbarung zur Auftragsverarbeitung (Art. 28 DSGVO) (Data Processing Addendum, Bestandteil der Supabase-Nutzungsbedingungen).</p>
        <h2>3. Reichweitenmessung</h2>
        <p>Wir nutzen Vercel Web Analytics. Es werden keine Cookies gesetzt und keine personenbezogenen Profile gebildet; Besuche werden anonymisiert gezählt (Art. 6 Abs. 1 lit. f DSGVO).</p>
        <p>Im Footer zeigen wir an, wie viele Gäste gerade auf Futterprüfer sind. Das geschieht nur, wenn Sie im Datenschutzhinweis „Zustimmen“ gewählt haben (§ 25 Abs. 1 TDDDG, Art. 6 Abs. 1 lit. a DSGVO). Dann legt Ihr Browser eine zufällige Kennung im lokalen Speicher ab und sendet sie alle 30 Sekunden an unseren Server, solange eine Seite sichtbar ist. Wir speichern die Kennung mit einem Zeitstempel in unserer Datenbank bei Supabase (siehe Abschnitt 2), ordnen sie keiner Person zu und löschen sie nach spätestens zehn Minuten. Ihre IP-Adresse speichern wir dafür nicht; der Server verwendet sie nur kurz im Arbeitsspeicher, um Missbrauch des Zählers zu begrenzen, und protokolliert sie nicht (Art. 6 Abs. 1 lit. f DSGVO; unser berechtigtes Interesse ist der Schutz der Website vor Überlastung). Ihre Einwilligung können Sie jederzeit mit Wirkung für die Zukunft widerrufen, über den Link „Datenschutz-Einstellungen“ unten auf jeder Seite; die Kennung wird dann gelöscht.</p>
        <h2>4. Lokale Speicherung</h2>
        <p>Im lokalen Speicher Ihres Browsers werden Ihre Farbschema-Wahl (hell/dunkel) und Ihre Entscheidung im Datenschutzhinweis gespeichert. Diese Daten verlassen Ihr Gerät nicht. Nur wenn Sie „Zustimmen“ gewählt haben, legt Ihr Browser zusätzlich die zufällige Kennung für die Live-Anzeige der Gäste ab; sie wird im Unterschied zu den beiden anderen Einträgen an unseren Server gesendet (siehe Abschnitt 3) und bei Widerruf gelöscht.</p>
        <h2>5. Kontaktformular</h2>
        <p>Ihre Angaben (Name, E-Mail, Nachricht) werden zur Bearbeitung der Anfrage gespeichert und per E-Mail-Dienst Resend an uns übermittelt (Art. 6 Abs. 1 lit. b bzw. f DSGVO). Zum Schutz vor Spam kann Cloudflare Turnstile eingesetzt werden. Spätestens sechs Monate nach Abschluss der Anfrage werden die Daten gelöscht, sofern keine gesetzlichen Aufbewahrungspflichten entgegenstehen.</p>
        <h2>6. Newsletter</h2>
        <p>Wenn Sie unseren Newsletter abonnieren, verarbeiten wir Ihre E-Mail-Adresse im Double-Opt-In-Verfahren: Sie erhalten zunächst eine Bestätigungs-E-Mail und werden erst nach Klick auf den Link in den Verteiler aufgenommen (Art. 6 Abs. 1 lit. a DSGVO). Der Versand erfolgt über den Dienstleister Brevo (Sendinblue GmbH, Berlin). Sie können den Newsletter jederzeit über den Abmeldelink in jeder E-Mail abbestellen.</p>
        <h2>7. Vorlesefunktion</h2>
        <p>Die Vorlesefunktion nutzt die Sprachausgabe Ihres Geräts. Texte werden nicht an uns übertragen.</p>
        <h2>8. Ihre Rechte</h2>
        <p>Sie haben das Recht auf Auskunft, Berichtigung, Löschung, Einschränkung der Verarbeitung, Datenübertragbarkeit und Widerspruch sowie das Recht auf Beschwerde bei einer Datenschutz-Aufsichtsbehörde.</p>
      </div>
    </PageShell>
  );
}
