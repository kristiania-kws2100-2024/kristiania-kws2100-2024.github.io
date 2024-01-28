import React, { useContext, useEffect, useState } from "react";
import { MapContext } from "../map/mapContext";
import { stationLayer } from "./stationLayer";

export function StationLayerCheckbox() {
  const { setLayers } = useContext(MapContext);
  const [checked, setChecked] = useState(true);

  useEffect(() => {
    if (checked) {
      setLayers((old) => [...old, stationLayer]);
    }
    return () => {
      setLayers((old) => old.filter((l) => l !== stationLayer));
    };
  }, [checked]);

  return (
    <div>
      <label>
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => setChecked(e.target.checked)}
        />
        Show countries
      </label>
    </div>
  );
}
