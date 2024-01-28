import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { GeoJSON } from "ol/format";
import { Feature } from "ol";
import { Polygon } from "ol/geom";

export type FylkeLayer = VectorLayer<VectorSource<FylkeFeature>>;
export type FylkeFeature = {
  getProperties(): FylkeProperties;
} & Feature<Polygon>;
export interface FylkeProperties {
  fylkenummer: string;
  navn: StedsNavn[];
}
export interface StedsNavn {
  sprak: "nor" | "smj";
  navn: string;
}

export const fylkeLayer = new VectorLayer({
  className: "fylke",
  source: new VectorSource({
    url: "/fylker.json",
    format: new GeoJSON(),
  }),
});
