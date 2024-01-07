import { useContext, useEffect, useMemo } from "react";
import { MapContext } from "../map/mapContextProvider";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { GeoJSON } from "ol/format";

export function useKommuneLayer(show: boolean) {
  const { setLayers } = useContext(MapContext);

  const kommuneLayer = useMemo(() => {
    return new VectorLayer({
      source: new VectorSource({
        url: "/kommuner.json",
        format: new GeoJSON(),
      }),
    });
  }, []);

  useEffect(() => {
    if (show) {
      setLayers((old) => [...old, kommuneLayer]);
    }
    return () => setLayers((old) => old.filter((l) => l !== kommuneLayer));
  }, [show]);

  return kommuneLayer;
}
