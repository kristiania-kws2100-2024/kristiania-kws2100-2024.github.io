import { Feature, MapBrowserEvent } from "ol";
import { Layer } from "ol/layer";
import { useContext, useEffect, useMemo, useState } from "react";
import { MapContext } from "./mapContext";
import { useViewExtent } from "./useViewExtent";
import VectorLayer from "ol/layer/Vector";

interface UseFeaturesReturnType<T extends Feature> {
  /**
   * a filtered list of features which are currently shown on the view.
   */
  visibleFeatures: T[];
  /**
   * all features in the layer. Empty if the layerPredicate
   * matched no currently displayed layers
   */
  features: T[];
  /**
   * active feature. When the user moves the pointer over the map,
   * this will be updated to the feature under the pointer (if any)
   */
  activeFeature?: T;
  /**
   * Updates activeFeature manually. activeFeature will keep this value
   * until the user moves the pointer over the map
   */
  setActiveFeature(feature?: T): void;
}

/**
 * Uses layerPredicate to find a layer and returns the features of that
 * layer. The return value contains all the features of the layer, as well
 * as all visible features.
 *
 * You can specify the type of the Features returned which will let you
 * have typesafe properties
 *
 * @param layerPredicate a function that returns a boolean for each layer.
 * You should pass in a function that returns true for the layer you want
 * to retrieve features for. For example
 * ```(layer) => layer.getClassName() === "kommuner"```
 * @return features, visibleFeatures, activeFeature and setActiveFeature
 *
 * @example
 * const { visibleFeatures } = useFeatures<KommuneFeature>(
 *  l => l.getClassName() === "kommuner"
 * );
 */
export function useFeatures<T extends Feature>(
  layerPredicate: (layer: Layer) => boolean,
): UseFeaturesReturnType<T> {
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
