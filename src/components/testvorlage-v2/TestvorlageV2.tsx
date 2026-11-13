import dynamic from "next/dynamic";
import { Fragment, type ReactNode } from "react";
import { isRotScore } from "@/lib/rot-guard";
import { AnalyticalValues } from "./AnalyticalValues";
import { ArticleNavigation } from "./ArticleNavigation";
import { EditorialConclusion } from "./EditorialConclusion";
import { FeedingTable } from "./FeedingTable";
import { Html } from "./Html";
import { IngredientAccordion } from "./IngredientAccordion";
import { ManufacturerClaims } from "./ManufacturerClaims";
import { ProductFAQ } from "./ProductFAQ";
import { ProductFacts } from "./ProductFacts";
import { ProductTestHero } from "./ProductTestHero";
import { ProsCons } from "./ProsCons";
import { SafetyAssessment } from "./SafetyAssessment";
import { ScientificEvidence } from "./ScientificEvidence";
import { ScoreBreakdown } from "./ScoreBreakdown";
import { TvSection } from "./Section";
import { AmazonKauf, Sources } from "./Sources";
import { baueAbschnitte, kaufLink, type BlockTyp, type LayoutData } from "./schema";
import "@/styles/testvorlage-v2.css";

const CostCalculator = dynamic(() => import("./CostCalculator").then((mod) => mod.CostCalculator));

function Block({ typ, data }: { typ: BlockTyp; data: LayoutData }): ReactNode {
  switch (typ) {
    case "zutaten": return <IngredientAccordion zutaten={data.zutaten} />;
    case "analyse": return (<><AnalyticalValues werte={data.analysewerte} /><FeedingTable dosierung={data.dosierung} /></>);
    case "evidenz": return <ScientificEvidence evidenz={data.evidenz} />;
    case "herstellerangaben": return <ManufacturerClaims angaben={data.herstellerangaben} />;
    case "preisrechner": return data.preisrechner ? <CostCalculator {...data.preisrechner} /> : null;
    case "sicherheit": return <SafetyAssessment sicherheit={data.sicherheit} />;
    case "proscons": return <ProsCons pros={data.pros} cons={data.cons} />;
  }
}

const LABEL: Record<string, string> = { urteil: "URTEIL", kapitel: "KAPITEL", block: "KAPITEL", fazit: "FAZIT", faq: "FAQ", quellen: "QUELLEN" };

/**
 * Feste Testvorlage V2. Rendert nur die Bausteine, die in layoutData stehen (Daten und Darstellung sind getrennt).
 * Die Seite liefert H1, Badges und Metazeile über `kopf` (sie stehen in der Hero-Fläche) und die Produktbilder über `medien`; hier gibt es keine zweite H1.
 * Der Haupttacho zeigt immer die Gesamtwertung. Der Hauptinhalt wird serverseitig gerendert, nur der Kostenrechner ist ein Client-Baustein.
 */
export function TestvorlageV2({ data, totalScore, ampelLabel, kopf, medien, methodikVersion, kaufNeutral = false }: { data: LayoutData; totalScore: number; ampelLabel: string; kopf?: ReactNode; medien?: ReactNode; methodikVersion?: string | null; kaufNeutral?: boolean }) {
  const abschnitte = baueAbschnitte(data);
  const kauf = kaufLink(data);
  const asinKauf = data.asin ? kaufLink({ asin: data.asin }) : null;
  const rot = isRotScore(totalScore, methodikVersion);
  // Regel V12: neutraler Button unabhängig von der Ampel (Heilaussage am Test, beanstandete Krankheitswerbung, Ausschlussliste)
  const neutral = kaufNeutral || data.kaufNeutral === true;
  const zusatz = data.kaufHinweisZusatz;
  const hatFazit = abschnitte.some((a) => a.art === "fazit");
  // Oberer Button aus der ASIN: direkt nach dem Fazit. Ohne Fazit-Abschnitt nach der Gesamtwertung.
  const kaufOben = asinKauf ? <AmazonKauf url={asinKauf} rot={rot} neutral={neutral} zusatz={zusatz} className="kauf kauf-top" /> : null;
  return (
    <div className="tv2" data-layout="TESTVORLAGE_V2">
      <ProductTestHero hero={data.hero} totalScore={totalScore} ampelLabel={ampelLabel} kopf={kopf} methodikVersion={methodikVersion} />
      {!hatFazit && kaufOben}
      <ProductFacts kennzahlen={data.kennzahlen} />
      {medien}
      <ArticleNavigation abschnitte={abschnitte} variante="mobil" />
      <div className="layout">
        <ArticleNavigation abschnitte={abschnitte} variante="sidebar" />
        <div className="article">
          {abschnitte.map((a) => {
            const label = LABEL[a.art];
            switch (a.art) {
              case "urteil":
                return <TvSection key={a.id} id={a.id} nummer={a.nummer} label={label} titel={a.titel}><ScoreBreakdown kriterien={data.kriterien} urteil={data.urteil} methodikVersion={methodikVersion} /></TvSection>;
              case "kapitel": {
                const k = data.kapitel![a.index];
                return (
                  <TvSection key={a.id} id={a.id} nummer={a.nummer} label={label} titel={a.titel}>
                    {k.html && <Html html={k.html} />}
                    {k.block && <Block typ={k.block} data={data} />}
                  </TvSection>
                );
              }
              case "block":
                return <TvSection key={a.id} id={a.id} nummer={a.nummer} label={label} titel={a.titel}><Block typ={a.block} data={data} /></TvSection>;
              case "fazit":
                return (
                  <Fragment key={a.id}>
                    <TvSection id={a.id} nummer={a.nummer} label={label} titel={a.titel} final><EditorialConclusion fazit={data.fazit} /></TvSection>
                    {kaufOben}
                  </Fragment>
                );
              case "faq":
                return <TvSection key={a.id} id={a.id} nummer={a.nummer} label={label} titel={a.titel}><ProductFAQ faq={data.faq} /></TvSection>;
              case "quellen":
                return (
                  <TvSection key={a.id} id={a.id} nummer={a.nummer} label={label} titel={a.titel}>
                    <Sources quellen={data.quellen} pruefstand={data.pruefstand} methodikHinweis={data.methodikHinweis} kaufUrl={kauf} rot={rot} neutral={neutral} zusatz={zusatz} />
                  </TvSection>
                );
            }
          })}
        </div>
      </div>
    </div>
  );
}
