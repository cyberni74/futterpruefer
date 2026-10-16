import { describe, expect, it } from "vitest";
import nextConfig from "../../next.config";
import { CANONICAL_ORIGIN, REDIRECT_HOSTS } from "./site";

describe("Host-Weiterleitungen", () => {
  it("schickt www und vercel.app per 301 auf https://futterpruefer.de, nicht auf die Umlaut-Domain", async () => {
    if (!nextConfig.redirects) throw new Error("redirects fehlen in next.config");
    const rules = await nextConfig.redirects();
    const hostRules = rules.filter((rule) => rule.has?.some((h) => h.type === "host"));
    expect(hostRules).toHaveLength(REDIRECT_HOSTS.length);
    for (const host of REDIRECT_HOSTS) {
      expect(hostRules).toContainEqual({
        source: "/:path*",
        has: [{ type: "host", value: host }],
        destination: `${CANONICAL_ORIGIN}/:path*`,
        statusCode: 301,
      });
    }
    const hosts = hostRules.flatMap((rule) => rule.has?.filter((h) => h.type === "host").map((h) => h.value) ?? []);
    expect(hosts).not.toContain("futterpruefer.de");
    expect(hosts).not.toContain("xn--futterprfer-0hb.de");
    expect(hostRules.every((rule) => rule.destination.startsWith("https://futterpruefer.de/"))).toBe(true);
    expect(JSON.stringify(hostRules)).not.toContain("xn--futterprfer-0hb.de/");
  });
});
