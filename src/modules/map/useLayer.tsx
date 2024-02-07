import { Layer } from "ol/layer";
import { useContext, useEffect } from "react";
import { MapContext } from "./mapContext";

export function useLayer(layer: Layer, checked: boolean) {
  const { setLayers } = useContext(MapContext);

  useEffect(() => {
    if (checked) {
      setLayers((old) => [...old, layer]);
    }
    return () => {
      setLayers((old) => old.filter((l) => l !== layer));
    };
  }, [checked]);
}
