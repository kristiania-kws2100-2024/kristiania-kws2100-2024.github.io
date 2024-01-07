import React, {
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { KommuneProperties } from "./kommune";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { GeoJSON } from "ol/format";
import { MapBrowserEvent } from "ol";
import { MapContext } from "../map/mapContext";

export function ToggleKommuneCheckbox({
  setKommune,
}: {
  setKommune: Dispatch<SetStateAction<KommuneProperties | undefined>>;
}) {
  const [showKommuner, setShowKommuner] = useState(false);
  const kommuneLayer = useMemo(() => {
    return new VectorLayer({
      className: "kommuner",
      source: new VectorSource({
        url: "/kommuner.json",
        format: new GeoJSON(),
      }),
    });
  }, []);

  function handlePointerMove(e: MapBrowserEvent<MouseEvent>) {
    const featuresAtCoordinate = kommuneLayer
      .getSource()
      ?.getFeaturesAtCoordinate(e.coordinate);
    const kommune = (
      featuresAtCoordinate
        ? featuresAtCoordinate[0]?.getProperties()
        : undefined
    ) as KommuneProperties | undefined;
    setKommune((old) =>
      old?.kommunenummer != kommune?.kommunenummer ? kommune : old,
    );
  }

  const { setLayers, map } = useContext(MapContext);
  useEffect(() => {
    if (showKommuner) {
      setLayers((old) => [...old, kommuneLayer]);
      map.on("pointermove", handlePointerMove);
    } else {
      setLayers((old) => old.filter((l) => l != kommuneLayer));
      map.un("pointermove", handlePointerMove);
    }
  }, [showKommuner]);

  return (
    <div>
      <label>
        <input
          type="checkbox"
          checked={showKommuner}
          onChange={(e) => setShowKommuner(e.target.checked)}
        />
        <span>{showKommuner ? "Hide" : "Show"} kommuner</span>
      </label>
    </div>
  );
}
