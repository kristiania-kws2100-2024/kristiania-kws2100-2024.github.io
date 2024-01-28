import { Feature, MapBrowserEvent } from "ol";
import { Layer } from "ol/layer";
import { useContext, useEffect, useMemo, useState } from "react";
import { MapContext } from "./mapContext";
import { useViewExtent } from "./useViewExtent";
import VectorLayer from "ol/layer/Vector";

export function useFeatures<T extends Feature>(
  layerPredicate: (layer: Layer) => boolean,
) {
  const { layers, map } = useContext(MapContext);
  const viewExtent = useViewExtent();
  const layer = useMemo(
    () => layers.find(layerPredicate) as VectorLayer<any>,
    [layers],
  );
  const [features, setFeatures] = useState<T[]>([]);
  const visibleFeatures = useMemo(
    () => features.filter((f) => f.getGeometry()?.intersectsExtent(viewExtent)),
    [features, viewExtent],
  );
  const [activeFeature, setActiveFeature] = useState<T>();
  function handlePointermove(e: MapBrowserEvent<MouseEvent>) {
    const features = layer?.getSource().getFeaturesAtCoordinate(e.coordinate);
    setActiveFeature(features?.length === 1 ? features[0] : undefined);
  }
  useEffect(() => {
    if (layer) {
      map.on("pointermove", handlePointermove);
    }
    return () => map.un("pointermove", handlePointermove);
  }, [map, layer]);

  function loadFeatures() {
    setFeatures(layer?.getSource()?.getFeatures() || []);
  }

  useEffect(() => {
    layer?.on("change", loadFeatures);
    loadFeatures();
    return () => {
      layer?.un("change", loadFeatures);
      setFeatures([]);
    };
  }, [layer]);
  return { features, visibleFeatures, activeFeature, setActiveFeature };
}
