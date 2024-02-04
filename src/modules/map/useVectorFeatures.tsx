import { Feature } from "ol";
import { Layer } from "ol/layer";
import { useContext, useEffect, useMemo, useState } from "react";
import { MapContext } from "./mapContext";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";

export function useVectorFeatures<FEATURE extends Feature>(
  layerSelector: (l: Layer) => boolean,
) {
  const { map, layers } = useContext(MapContext);
  const layer = useMemo(
    () => layers.find(layerSelector),
    [layers],
  ) as VectorLayer<VectorSource>;
  const [features, setFeatures] = useState<FEATURE[]>([]);
  const [viewExtent, setViewExtent] = useState(
    map.getView().getViewStateAndExtent().extent,
  );
  const visibleFeatures = useMemo(
    () => features.filter((f) => f.getGeometry()?.intersectsExtent(viewExtent)),
    [features, viewExtent],
  );

  function handleSourceChange() {
    setFeatures(layer?.getSource()?.getFeatures() as FEATURE[]);
  }

  function handleViewChange() {
    setViewExtent(map.getView().getViewStateAndExtent().extent);
  }

  useEffect(() => {
    layer?.getSource()?.on("change", handleSourceChange);
    return () => {
      layer?.getSource()?.un("change", handleSourceChange);
      setFeatures([]);
    };
  }, [layer]);

  useEffect(() => {
    setTimeout(handleViewChange, 200);
    map.getView().on("change", handleViewChange);
    return () => map.getView().un("change", handleViewChange);
  }, [map]);

  return { layer, features, visibleFeatures };
}
