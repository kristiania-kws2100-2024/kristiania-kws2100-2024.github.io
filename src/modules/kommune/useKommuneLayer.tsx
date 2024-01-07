import { useContext, useEffect, useMemo } from "react";
import { MapContext } from "../map/mapContextProvider";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { GeoJSON } from "ol/format";
import { Feature, MapBrowserEvent } from "ol";

export function useKommuneLayer(
  show: boolean,
  onClick: (features: Feature[]) => void,
) {
  const { setLayers, map } = useContext(MapContext);

  const kommuneLayer = useMemo(() => {
    return new VectorLayer({
      className: "kommuner",
      source: new VectorSource({
        url: "/kommuner.json",
        format: new GeoJSON(),
      }),
    });
  }, []);

  function handleClick(e: MapBrowserEvent<MouseEvent>) {
    onClick(
      kommuneLayer.getSource()?.getFeaturesAtCoordinate(e.coordinate) || [],
    );
  }

  useEffect(() => {
    if (show) {
      setLayers((old) => [...old, kommuneLayer]);
      map.on("click", handleClick);
    }
    return () => {
      map.un("click", handleClick);
      setLayers((old) => old.filter((l) => l !== kommuneLayer));
    };
  }, [show]);

  return kommuneLayer;
}
