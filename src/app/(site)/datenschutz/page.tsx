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
        <p>Live-Anzeige „Gäste online“: Unten auf der Seite (mobil in der Menüleiste, ab Tablet im Footer) zeigen wir an, wie viele Besucher in den letzten 90 Sekunden eine Seite von Futterprüfer geöffnet hatten. Gezählt werden nur Besucher, die im Datenschutzhinweis „Zustimmen“ gewählt haben; die angezeigte Zahl kann daher niedriger sein als die tatsächliche Besucherzahl. Rechtsgrundlage ist Ihre Einwilligung (§ 25 Abs. 1 TDDDG, Art. 6 Abs. 1 lit. a DSGVO). Nach Ihrer Zustimmung legt Ihr Browser eine zufällig erzeugte Kennung im lokalen Speicher ab und sendet sie alle 30 Sekunden an unseren Server, solange eine Seite sichtbar ist. Die Kennung ist pseudonym: Sie enthält keine Angaben über Sie, wir ordnen sie keiner Person zu und führen sie nicht mit anderen Daten zusammen. Auf dem Server speichern wir nur die Kennung und den Zeitpunkt der letzten Meldung in unserer Datenbank bei Supabase (Frankfurt am Main, siehe Abschnitt 2) und löschen den Eintrag automatisch, spätestens eine Viertelstunde nach der letzten Meldung. In Ihrem Browser bleibt die Kennung gespeichert, bis Sie Ihre Einwilligung widerrufen oder den Speicher Ihres Browsers löschen. Die Meldung läuft über unseren Hoster Vercel (siehe Abschnitt 2); dabei wird technisch bedingt Ihre IP-Adresse verarbeitet. Für den Zähler speichern wir die IP-Adresse nicht; der Server nutzt sie nur kurzzeitig als gesalzenen Hashwert im Arbeitsspeicher, um Missbrauch des Zählers zu begrenzen (Art. 6 Abs. 1 lit. f DSGVO; unser berechtigtes Interesse ist der Schutz der Website vor Überlastung). Ihre Einwilligung ist freiwillig. Sie können sie jederzeit mit Wirkung für die Zukunft widerrufen: über den Link „Datenschutz-Einstellungen“ unten auf jeder Seite und dort „Nur notwendige“. Die Kennung wird dann in Ihrem Browser gelöscht und nicht mehr gesendet.</p>
        <h2>4. Lokale Speicherung</h2>
        <p>Im lokalen Speicher Ihres Browsers speichern wir Ihre Farbschema-Wahl (hell/dunkel), Ihre Entscheidung im Datenschutzhinweis und den Zeitpunkt dieser Entscheidung. Diese Einträge sind unbedingt erforderlich, damit die Website Ihre Wahl umsetzen und nachweisen kann, wann Sie entschieden haben (§ 25 Abs. 2 Nr. 2 TDDDG). Sie verlassen Ihr Gerät nicht und bleiben gespeichert, bis Sie den Speicher Ihres Browsers löschen. Den Datenschutzhinweis zeigen wir nach sechs Monaten erneut an; bis zu Ihrer neuen Wahl gilt Ihre bisherige Entscheidung. Nur wenn Sie „Zustimmen“ gewählt haben, legt Ihr Browser zusätzlich die zufällige Kennung für die Live-Anzeige „Gäste online“ ab; sie wird an unseren Server gesendet (siehe Abschnitt 3) und bei Widerruf gelöscht.</p>
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
