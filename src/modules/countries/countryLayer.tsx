import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { GeoJSON } from "ol/format";
import { Feature } from "ol";
import { Polygon } from "ol/geom";
import { Stroke, Style } from "ol/style";

export type CountryLayer = VectorLayer<VectorSource<CountryFeature>>;
export type CountryFeature = {
  getProperties(): CountryProperties;
} & Feature<Polygon>;
export interface CountryProperties {
  ADMIN: string;
  ISO_A2: string;
  ISO_A3: string;
}

export const countryLayer = new VectorLayer({
  className: "country",
  source: new VectorSource({
    url: "/countries.json",
    format: new GeoJSON(),
  }),
  style: new Style({
    stroke: new Stroke({ color: "black", width: 3 }),
  }),
});
