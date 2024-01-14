import { Map, MapBrowserEvent } from "ol";
import { useEffect, useMemo, useState } from "react";
import { KommuneFeature } from "./kommune";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { GeoJSON } from "ol/format";

export function useKommuneLayer(show: boolean, map: Map) {
  const [clickedFeature, setClickedFeature] = useState<
    KommuneFeature | undefined
  >();

  const layer = useMemo(() => {
    return new VectorLayer({
      source: new VectorSource({
        url: "/kommuner.json",
        format: new GeoJSON(),
      }),
    });
  }, []);

  function handleClick(e: MapBrowserEvent<MouseEvent>) {
    const clickedKommuner = layer
      .getSource()
      ?.getFeaturesAtCoordinate(e.coordinate);

    setClickedFeature(
      clickedKommuner?.length
        ? (clickedKommuner[0] as KommuneFeature)
        : undefined,
    );
  }

  useEffect(() => {
    if (show) {
      map.on("click", handleClick);
    }
    return () => {
      map.un("click", handleClick);
    };
  }, [show]);
  return { layer, clickedFeature };
}
