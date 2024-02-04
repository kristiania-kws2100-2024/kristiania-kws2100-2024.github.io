import { Feature, MapBrowserEvent } from "ol";
import { Layer } from "ol/layer";
import { useContext, useEffect, useMemo, useState } from "react";
import { MapContext } from "./mapContext";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";

export function useActiveFeatures<FEATURE extends Feature>(
  predicate: (l: Layer) => boolean,
) {
  const { map, layers } = useContext(MapContext);
  const layer = useMemo(
    () => layers.find(predicate),
    [layers],
  ) as VectorLayer<VectorSource>;
  const [activeFeatures, setActiveFeatures] = useState<FEATURE[]>([]);

  function handlePointerMove(e: MapBrowserEvent<MouseEvent>) {
    const features = layer
      ?.getSource()
      ?.getFeaturesAtCoordinate(e.coordinate) as FEATURE[];
    setActiveFeatures((old) => {
      if (old.length === 1 && features.length === 1 && old[0] === features[0]) {
        return old;
      } else {
        return features || [];
      }
    });
  }

  useEffect(() => {
    if (layer) {
      map.on("pointermove", handlePointerMove);
    }
    return () => map.un("pointermove", handlePointerMove);
  }, [layer]);

  return { activeFeatures, setActiveFeatures };
}
