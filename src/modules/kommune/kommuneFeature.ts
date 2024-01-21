import { Feature } from "ol";
import { Polygon } from "ol/geom";

export interface KommuneFeature extends Feature<Polygon> {
  getProperties(): KommuneProperties;
}

interface KommuneNavn {
  sprak: string;
  navn: string;
}

interface KommuneProperties {
  kommunenummer: string;
  navn: KommuneNavn[];
}