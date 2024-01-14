import { Feature } from "ol";

export type KommuneNavn = {
  sprak: "nor" | "fkv" | "sma" | "sme" | "smj";
  navn: string;
};

interface KommuneProperties {
  kommunenummer: string;
  navn: KommuneNavn[];
}

export type KommuneFeature = Feature & {
  getProperties(): KommuneProperties;
};
