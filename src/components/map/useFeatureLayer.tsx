import { Dispatch, SetStateAction, useEffect } from "react";
import { Layer } from "ol/layer";

export function useFeatureLayer(
  setFeatureLayers: React.Dispatch<React.SetStateAction<Layer[]>>,
  layer: Layer,
  show: boolean,
) {
  useEffect(() => {
    if (show) {
      setFeatureLayers((old) => [...old, layer]);
    } else {
      setFeatureLayers((old) => old.filter((l) => l !== layer));
    }
  }, [show]);
}
