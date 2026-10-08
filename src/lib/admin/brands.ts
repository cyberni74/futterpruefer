import { prisma } from "@/lib/db";
import { uniqueBrands } from "./brand-names";

export { canonicalBrand, uniqueBrands } from "./brand-names";

export async function getBrands(): Promise<string[]> {
  const rows = await prisma.review.findMany({ distinct: ["brand"], select: { brand: true } });
  return uniqueBrands(rows.map((r) => r.brand));
}
