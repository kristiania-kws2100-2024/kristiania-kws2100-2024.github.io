import { Feature } from "ol";
import { Polygon } from "ol/geom";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";

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

export type KommuneLayer = VectorLayer<VectorSource<KommuneFeature>>;
