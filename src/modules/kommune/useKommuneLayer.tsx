import { Feature, MapBrowserEvent } from "ol";
import { useContext, useEffect, useMemo } from "react";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { GeoJSON } from "ol/format";
import { MapContext } from "../map/mapContext";

export function useKommuneLayer(
  show: boolean,
  onClick: (features: Feature[]) => void,
) {
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
    const featuresAtCoordinate = kommuneLayer
      .getSource()
      ?.getFeaturesAtCoordinate(e.coordinate);
    onClick(featuresAtCoordinate || []);
  }

  const { map, setLayers } = useContext(MapContext);
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
