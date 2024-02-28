import { Feature } from "ol";
import { Layer } from "ol/layer";
import { useContext, useEffect, useMemo, useState } from "react";
import { MapContext } from "./mapContext";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";

/**
 * Uses layerPredicate to find a layer and returns the features of that
 * layer. The return value contains all the features of the layer, as well
 * as all visible features.
 *
 * You can specify the type of the Features returned which will let you
 * have typesafe properties
 *
 * @param layerSelector a function that returns a boolean for each layer.
 * You should pass in a function that returns true for the layer you want
 * to retrieve features for. For example
 * ```(layer) => layer.getClassName() === "kommuner"```
 * @return layer, features and visibleFeatures
 *
 * @example
 * const { visibleFeatures } = useVectorFeatures<KommuneFeature>(
 *  l => l.getClassName() === "kommuner"
 * );
 */
export function useVectorFeatures<FEATURE extends Feature>(
  layerSelector: (l: Layer) => boolean,
): {
  layer?: Layer;
  /**
   * a filtered list of features which are currently shown on the view.
   */
  visibleFeatures: FEATURE[];
  /**
   * all features in the layer. Empty if the layerSelector
   * matched no currently displayed layers
   */
  features: FEATURE[];
} {
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
