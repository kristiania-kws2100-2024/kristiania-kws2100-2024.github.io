import React, { useContext, useEffect, useState } from "react";
import { MapContext } from "../map/mapContext";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { GeoJSON } from "ol/format";

const kommuneLayer = new VectorLayer({
  source: new VectorSource({
    url: "/kommuner.json",
    format: new GeoJSON(),
  }),
});

export function KommuneLayerCheckbox() {
  const [checked, setChecked] = useState(true);

  const { setLayers } = useContext(MapContext);

  useEffect(() => {
    if (checked) {
      setLayers((old) => [...old, kommuneLayer]);
    }
  }, [checked]);

  return (
    <div>
      <label>
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => setChecked(e.target.checked)}
        />
        {checked ? "Hide" : "Show"} kommuner
      </label>
    </div>
  );
}
