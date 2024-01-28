import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { GeoJSON } from "ol/format";

export const kommuneLayer = new VectorLayer({
  className: "kommuner",
  source: new VectorSource({
    url: "/kommuner.json",
    format: new GeoJSON(),
  }),
});
