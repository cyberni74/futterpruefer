import { describe, expect, it } from "vitest";
import { autolinkPatterns, lexikonLinkTitle } from "./lexikon-autolink";

describe("Lexikon-Autolink, Rechtsprüfung", () => {
  it("lässt gesperrte Synonyme weg und behält den Eigennamen", () => {
    expect(autolinkPatterns("carrageen", "Carrageen", ["Carrageenan", "Geliermittel"])).toEqual(["Carrageen", "Carrageenan"]);
    expect(autolinkPatterns("bierhefe", "Bierhefe", ["Hefe"])).toEqual(["Bierhefe"]);
    expect(autolinkPatterns("lachsoel", "Lachsöl", ["Fischöl"])).toEqual(["Lachsöl"]);
    expect(autolinkPatterns("inulin", "Inulin", ["Zichorie", "Zichorienwurzel", "Chicorée-Wurzel", "FOS", "Fructooligosaccharide", "Oligofructose", "Fructan"])).toEqual(["Inulin"]);
    expect(autolinkPatterns("pflanzliche-nebenerzeugnisse", "Pflanzliche Nebenerzeugnisse", ["Kleie", "Rübenschnitzel", "Trester", "Ölschrot"])).toEqual(["Pflanzliche Nebenerzeugnisse"]);
    expect(autolinkPatterns("antioxidationsmittel", "Antioxidationsmittel", ["Tocopherole", "Rosmarinextrakt", "BHA", "Propylgallat", "Vitamin E"])).toEqual(["Antioxidationsmittel", "Vitamin E"]);
  });

  it("verlinkt BHA nur als Eigenname des Eintrags bha", () => {
    expect(autolinkPatterns("bha", "BHA", ["E 320"])).toEqual(["BHA", "E 320"]);
    expect(autolinkPatterns("antioxidationsmittel", "Antioxidationsmittel", ["BHA"])).not.toContain("BHA");
  });

  it("nennt im title nur den Lexikon-Namen", () => {
    expect(lexikonLinkTitle("Taurin")).toBe("Im Lexikon: Taurin");
  });
});
