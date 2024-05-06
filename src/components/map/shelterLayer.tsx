import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { GeoJSON } from "ol/format";
import { Fill, Style } from "ol/style";
import CircleStyle from "ol/style/Circle";
import { Map } from "ol";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Layer } from "ol/layer";
import { FeatureLike } from "ol/Feature";
import { unByKey } from "ol/Observable";

const shelterLayer = new VectorLayer({
  source: new VectorSource({
    url: "/geojson/shelters.json",
    format: new GeoJSON(),
  }),
  style: (feature) => {
    const radius = 10 + feature.getProperties().plasser / 400;
    return new Style({
      image: new CircleStyle({
        radius,
        fill: new Fill({ color: "green" }),
      }),
    });
  },
});

export function useShelterLayer(
  map: Map,
  setFeatureLayers: Dispatch<SetStateAction<Layer[]>>,
  showShelters: boolean,
) {
  const [activeShelterFeatures, setActiveShelterFeatures] = useState<
    FeatureLike[]
  >([]);
  useEffect(() => {
    if (showShelters) {
      setFeatureLayers((old) => [...old, shelterLayer]);
    } else {
      setFeatureLayers((old) => old.filter((l) => l !== shelterLayer));
    }

    const key = map.on("pointermove", (e) => {
      const features = map.getFeaturesAtPixel(e.pixel, {
        layerFilter: (l) => l === shelterLayer,
      });
      setActiveShelterFeatures(features);
    });
    return () => unByKey(key);
  }, [showShelters]);
  return { activeShelterFeatures };
}
