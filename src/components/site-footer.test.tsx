import { describe, expect, it, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { SiteFooter } from "./site-footer";
import ImpressumPage from "@/app/(site)/impressum/page";
import { AMAZON_PARTNER_NOTICE, TIKTOK_URL } from "@/lib/site";

vi.mock("./logo", () => ({ Logo: () => null }));

describe("Amazon-Partnerhinweis", () => {
  it("steht im Footer und im Impressum", () => {
    expect(AMAZON_PARTNER_NOTICE).toBe("Als Amazon-Partner verdiene ich an qualifizierten Verkäufen.");
    const footer = renderToStaticMarkup(<SiteFooter />);
    expect(footer).toContain(AMAZON_PARTNER_NOTICE);
    expect(footer).toContain("Cookie-Einstellungen");
    expect(footer).toContain(`href="${TIKTOK_URL}"`);
    expect(footer).toContain("Futterprüfer auf TikTok");
    expect(footer).not.toContain('rel="noopener nofollow"');
    expect(renderToStaticMarkup(<ImpressumPage />)).toContain(AMAZON_PARTNER_NOTICE);
  });
});
