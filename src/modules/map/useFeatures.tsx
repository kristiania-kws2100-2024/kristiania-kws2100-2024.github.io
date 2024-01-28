import { Feature } from "ol";
import { Layer } from "ol/layer";
import { useContext, useEffect, useMemo, useState } from "react";
import { MapContext } from "./mapContext";
import { useViewExtent } from "./useViewExtent";
import VectorLayer from "ol/layer/Vector";

export function useFeatures<T extends Feature>(
  layerPredicate: (layer: Layer) => boolean,
) {
  const { layers } = useContext(MapContext);
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
  return { features, visibleFeatures };
}
