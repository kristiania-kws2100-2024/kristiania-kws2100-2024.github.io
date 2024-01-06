import React, { useContext, useEffect, useMemo, useState } from "react";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { GeoJSON } from "ol/format";
import { MapContext } from "./mapContext";

export function ToggleKommuneCheckbox() {
  const [showKommuner, setShowKommuner] = useState(false);
  const kommuneLayer = useMemo(
    () =>
      new VectorLayer({
        source: new VectorSource({
          url: "/kommuner.json",
          format: new GeoJSON(),
        }),
      }),
    [],
  );
  const { setLayers } = useContext(MapContext);
  useEffect(() => {
    if (showKommuner) {
      setLayers((old) => [...old, kommuneLayer]);
    } else {
      setLayers((old) => old.filter((l) => l != kommuneLayer));
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
