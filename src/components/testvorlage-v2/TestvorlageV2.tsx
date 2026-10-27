import type { ReactNode } from "react";
import { AnalyticalValues } from "./AnalyticalValues";
import { ArticleNavigation } from "./ArticleNavigation";
import { CostCalculator } from "./CostCalculator";
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
import { Sources } from "./Sources";
import { baueAbschnitte, kaufLink, type BlockTyp, type LayoutData } from "./schema";
import "@/styles/testvorlage-v2.css";

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
export function TestvorlageV2({ data, totalScore, ampelLabel, kopf, medien }: { data: LayoutData; totalScore: number; ampelLabel: string; kopf?: ReactNode; medien?: ReactNode }) {
  const abschnitte = baueAbschnitte(data);
  const kauf = kaufLink(data);
  return (
    <div className="tv2" data-layout="TESTVORLAGE_V2">
      <ProductTestHero hero={data.hero} totalScore={totalScore} ampelLabel={ampelLabel} kopf={kopf} />
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
                return <TvSection key={a.id} id={a.id} nummer={a.nummer} label={label} titel={a.titel}><ScoreBreakdown kriterien={data.kriterien} urteil={data.urteil} /></TvSection>;
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
                return <TvSection key={a.id} id={a.id} nummer={a.nummer} label={label} titel={a.titel} final><EditorialConclusion fazit={data.fazit} /></TvSection>;
              case "faq":
                return <TvSection key={a.id} id={a.id} nummer={a.nummer} label={label} titel={a.titel}><ProductFAQ faq={data.faq} /></TvSection>;
              case "quellen":
                return (
                  <TvSection key={a.id} id={a.id} nummer={a.nummer} label={label} titel={a.titel}>
                    <Sources quellen={data.quellen} pruefstand={data.pruefstand} methodikHinweis={data.methodikHinweis} kaufUrl={kauf} kaufLabel={data.kaufLabel} />
                  </TvSection>
                );
            }
          })}
        </div>
      </div>
    </div>
  );
}
