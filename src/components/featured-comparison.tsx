import { MONTHS } from "@/lib/site";
import { comparisonPath, showsWinnerSeal, type FeaturedComparison } from "@/lib/featured-comparison";
import { FeatureHero, HeroSeal, SEAL_POSITION } from "./product-of-month";

type Props = {
  comparison: FeaturedComparison & { post: { imageUrl: string | null; imageAlt: string; imageBlur: string | null } };
};

/** Vergleichstest auf der Startseite, im selben Kasten wie das Produkt des Monats. Pokal nur bei Testsieger ab Gelb. */
export function FeaturedComparisonHero({ comparison: c }: Props) {
  const sub = `${MONTHS[c.month - 1]} ${c.year}`;
  const sieger = showsWinnerSeal(c);
  return (
    <FeatureHero
      headingId={`${sieger ? "testsieger" : "vergleich"}-heading-${c.slug}`}
      kicker={sieger ? `Testsieger · ${c.testName}` : `Vergleichstest · ${c.testName}`}
      srPrefix={sieger ? `Testsieger im Vergleichstest ${c.testName}: ` : `Vergleichstest ${c.testName}: `}
      title={sieger && c.winner ? c.winner : "Kein Testsieger"}
      score={sieger && c.score != null ? c.score : undefined}
      text={c.summary}
      image={{ src: c.post.imageUrl, alt: c.post.imageAlt || c.imageAltFallback, blur: c.post.imageBlur }}
      seal={sieger ? <HeroSeal top="Test" main="Sieger" sub={sub} label={`Testsieger ${c.testName}`} className={SEAL_POSITION} /> : null}
      primary={{ href: comparisonPath(c), label: "Zum Test" }}
      secondary={{ href: "/tests", label: "Alle Tests" }}
    />
  );
}
