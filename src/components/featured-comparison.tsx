import { MONTHS } from "@/lib/site";
import { comparisonPath, type FeaturedComparison } from "@/lib/featured-comparison";
import { FeatureHero, HeroSeal, SEAL_POSITION } from "./product-of-month";

type Props = {
  comparison: FeaturedComparison & { post: { imageUrl: string | null; imageAlt: string; imageBlur: string | null } };
};

/** Testsieger des aktuellen großen Vergleichstests, im selben Kasten wie das Produkt des Monats. */
export function FeaturedComparisonHero({ comparison: c }: Props) {
  const sub = `${MONTHS[c.month - 1]} ${c.year}`;
  return (
    <FeatureHero
      headingId="testsieger-heading"
      kicker={`Testsieger · ${c.testName}`}
      srPrefix={`Testsieger im Vergleichstest ${c.testName}: `}
      title={c.winner}
      score={c.score}
      text={c.summary}
      image={{ src: c.post.imageUrl, alt: c.post.imageAlt || c.imageAltFallback, blur: c.post.imageBlur }}
      seal={<HeroSeal top="Test" main="Sieger" sub={sub} label={`Testsieger ${c.testName}`} className={SEAL_POSITION} />}
      primary={{ href: comparisonPath(c), label: "Zum Test" }}
      secondary={{ href: "/tests", label: "Alle Tests" }}
    />
  );
}
