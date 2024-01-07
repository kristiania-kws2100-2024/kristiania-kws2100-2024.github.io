import { Layer } from "ol/layer";
import { useContext, useEffect, useMemo, useState } from "react";
import { MapContext } from "./mapContextProvider";
import { Feature } from "ol";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";

export function useFeatureLayer(predicate: (l: Layer) => boolean) {
  const { layers } = useContext(MapContext);

  const [features, setFeatures] = useState<Feature[]>([]);

  const layer = useMemo(() => {
    return layers.find(predicate) as VectorLayer<VectorSource>;
  }, [layers]);

  function handleSourceChange() {
    setFeatures(layer?.getSource()?.getFeatures() || []);
  }

  useEffect(() => {
    layer?.getSource()?.on("change", handleSourceChange);
    handleSourceChange();
    return () => layer?.getSource()?.un("change", handleSourceChange);
  }, [layer]);

  return { features, layer };
}
