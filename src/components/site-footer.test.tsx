import { describe, expect, it, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { SiteFooter } from "./site-footer";
import ImpressumPage from "@/app/(site)/impressum/page";
import { AMAZON_PARTNER_NOTICE } from "@/lib/site";

vi.mock("./logo", () => ({ Logo: () => null }));

describe("Amazon-Partnerhinweis", () => {
  it("steht im Footer und im Impressum", () => {
    expect(AMAZON_PARTNER_NOTICE).toBe("Als Amazon-Partner verdiene ich an qualifizierten Verkäufen.");
    expect(renderToStaticMarkup(<SiteFooter />)).toContain(AMAZON_PARTNER_NOTICE);
    expect(renderToStaticMarkup(<ImpressumPage />)).toContain(AMAZON_PARTNER_NOTICE);
  });
});
