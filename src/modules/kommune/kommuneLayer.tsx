import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { GeoJSON } from "ol/format";
import { Feature } from "ol";
import { Polygon } from "ol/geom";
import { StedsNavn } from "../sted/stedsNavn";

export type KommuneLayer = VectorLayer<VectorSource<KommuneFeature>>;
export type KommuneFeature = {
  getProperties(): KommuneProperties;
} & Feature<Polygon>;
export interface KommuneProperties {
  kommunenummer: string;
  navn: StedsNavn[];
}

export const kommuneLayer = new VectorLayer({
  className: "kommuner",
  source: new VectorSource({
    url: "/kommuner.json",
    format: new GeoJSON(),
  }),
});
