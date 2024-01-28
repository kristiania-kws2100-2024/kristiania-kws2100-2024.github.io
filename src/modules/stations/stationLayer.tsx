import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { GeoJSON } from "ol/format";
import { Feature } from "ol";
import { Polygon } from "ol/geom";

export type StationLayer = VectorLayer<VectorSource<StationFeature>>;
export type StationFeature = {
  getProperties(): StationProperties;
} & Feature<Polygon>;
export interface StationProperties {
  objtype: "Stasjon";
  navn: string;
}

export const stationLayer = new VectorLayer({
  className: "station",
  source: new VectorSource({
    url: "/stations.json",
    format: new GeoJSON(),
  }),
});
