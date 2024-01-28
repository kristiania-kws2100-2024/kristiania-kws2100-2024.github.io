import React, { useContext, useEffect, useState } from "react";
import { MapContext } from "../map/mapContext";
import { countryLayer } from "./countryLayer";

export function CountryLayerCheckbox() {
  const { setLayers, map } = useContext(MapContext);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (checked) {
      setLayers((old) => [...old, countryLayer]);
      map.getView().setZoom(5);
    }
    return () => {
      setLayers((old) => old.filter((l) => l !== countryLayer));
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
