import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));
const findMany = vi.hoisted(() => vi.fn());
vi.mock("@/lib/db", () => ({ prisma: { review: { findMany }, lexikonEntry: { findMany: vi.fn(async () => []) }, glossaryTerm: { findMany: vi.fn(async () => []) } } }));

import { getReviewsForPost, RELATED_REVIEW_EXCLUDE } from "./content";

const post = { title: "Nahrungsergänzung für Hunde", keywords: ["Nahrungsergänzung"], excerpt: "", bodyHtml: "<p>Text</p>" };

describe("Ausschlussliste für „Passende Tests“", () => {
  beforeEach(() => findMany.mockReset().mockResolvedValue([{ id: "1", slug: "anderer-test" }]));

  it("schließt Medidog nur im Beitrag hunde-nahrungsergaenzung aus", async () => {
    expect(RELATED_REVIEW_EXCLUDE["hunde-nahrungsergaenzung"]).toEqual(["medidog-ulmenrinden-paste"]);
    await getReviewsForPost({ ...post, slug: "hunde-nahrungsergaenzung" });
    expect(findMany.mock.calls[0][0].where.slug).toEqual({ notIn: ["medidog-ulmenrinden-paste"] });
  });

  it("lässt andere Beiträge unverändert", async () => {
    await getReviewsForPost({ ...post, slug: "ulmenrinde-hund-darmgesundheit" });
    expect(findMany.mock.calls[0][0].where).not.toHaveProperty("slug");
    await getReviewsForPost(post);
    expect(findMany.mock.calls[1][0].where).not.toHaveProperty("slug");
  });
});
