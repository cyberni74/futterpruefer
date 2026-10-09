import type { Metadata } from "next";
import { PageShell, Todo } from "@/components/page-shell";
import { OPERATOR } from "@/lib/site";

export const metadata: Metadata = { title: "Datenschutzerklärung", description: "Datenschutzerklärung von Futterprüfer.de: Verantwortlicher, Hosting, Reichweitenmessung ohne Cookies, Kontaktformular, Newsletter und Ihre Rechte.", alternates: { canonical: "/datenschutz" } };

export default function DatenschutzPage() {
  return (
    <PageShell crumb="Datenschutz" title="Datenschutzerklärung">
      <div className="prose-fp">
        <h2>1. Verantwortlicher</h2>
        <p>
          {OPERATOR.name} ({OPERATOR.nameSuffix})<br />
          {OPERATOR.address[0][0]}, {OPERATOR.address[0][1]}<br />
          E-Mail: <a href={`mailto:${OPERATOR.email}`}>{OPERATOR.email}</a><br />
          Telefon: {OPERATOR.phone}
        </p>
        <p>Vertreter in der Europäischen Union nach Art. 27 DSGVO: {OPERATOR.europeRepresentative}, <Todo>Anschrift in der EU und E-Mail-Adresse eintragen</Todo></p>
        <h2>2. Hosting und Datenbank</h2>
        <p>Diese Website wird bei Vercel Inc. (USA) gehostet, die Server-Funktionen laufen in der Region Frankfurt. Beim Aufruf werden technisch notwendige Daten (IP-Adresse, Zeitpunkt, aufgerufene Seite, Browser) verarbeitet (Art. 6 Abs. 1 lit. f DSGVO). Die Übermittlung in die USA erfolgt auf Grundlage des EU-US Data Privacy Framework bzw. von EU-Standardvertragsklauseln. Mit Vercel besteht eine Vereinbarung zur Auftragsverarbeitung (Art. 28 DSGVO) <Todo>Vertrag bei Vercel abschließen bzw. bestätigen</Todo>.</p>
        <p>Die Inhalte der Website und Kontaktanfragen werden in einer Datenbank von Supabase (Rechenzentrum in Frankfurt am Main, Deutschland) gespeichert. Mit Supabase besteht eine Vereinbarung zur Auftragsverarbeitung (Art. 28 DSGVO) <Todo>Vertrag bei Supabase abschließen bzw. bestätigen</Todo>.</p>
        <h2>3. Reichweitenmessung</h2>
        <p>Wir nutzen Vercel Web Analytics. Es werden keine Cookies gesetzt und keine personenbezogenen Profile gebildet; Besuche werden anonymisiert gezählt (Art. 6 Abs. 1 lit. f DSGVO).</p>
        <h2>4. Lokale Speicherung</h2>
        <p>Im lokalen Speicher Ihres Browsers werden ausschließlich Ihre Farbschema-Wahl (hell/dunkel) und die Kenntnisnahme des Datenschutzhinweises gespeichert. Diese Daten verlassen Ihr Gerät nicht.</p>
        <h2>5. Kontaktformular</h2>
        <p>Ihre Angaben (Name, E-Mail, Nachricht) werden zur Bearbeitung der Anfrage gespeichert und per E-Mail-Dienst Resend an uns übermittelt (Art. 6 Abs. 1 lit. b bzw. f DSGVO). Zum Schutz vor Spam kann Cloudflare Turnstile eingesetzt werden. Die Daten werden gelöscht, sobald die Anfrage abschließend bearbeitet ist. <Todo>Speicherdauer festlegen</Todo></p>
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
