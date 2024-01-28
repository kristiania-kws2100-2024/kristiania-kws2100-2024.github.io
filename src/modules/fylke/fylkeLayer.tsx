import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { GeoJSON } from "ol/format";
import { Feature } from "ol";
import { Polygon } from "ol/geom";
import { Stroke, Style } from "ol/style";

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
  style: new Style({
    stroke: new Stroke({ color: "black", width: 3 }),
  }),
});
