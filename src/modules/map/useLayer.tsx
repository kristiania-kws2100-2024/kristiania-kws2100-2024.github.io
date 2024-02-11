import { Layer } from "ol/layer";
import { useContext, useEffect } from "react";
import { MapContext } from "./mapContext";

export function useLayer(layer: Layer, checked: boolean) {
  const { setFeatureLayers } = useContext(MapContext);

  useEffect(() => {
    if (checked) {
      setFeatureLayers((old) => [...old, layer]);
    }
    return () => {
      setFeatureLayers((old) => old.filter((l) => l !== layer));
    };
  }, [checked]);
}
