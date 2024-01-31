import React, { useContext, useEffect, useState } from "react";
import { MapContext } from "../map/mapContext";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { GeoJSON } from "ol/format";

const fylkeLayer = new VectorLayer({
  className: "fylker",
  source: new VectorSource({
    url: "/fylker.json",
    format: new GeoJSON(),
  }),
});

export function FylkeLayerCheckbox() {
  const [checked, setChecked] = useState(false);

  const { setLayers } = useContext(MapContext);

  useEffect(() => {
    if (checked) {
      setLayers((old) => [...old, fylkeLayer]);
    }
    return () => {
      setLayers((old) => old.filter((l) => l !== fylkeLayer));
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
        {checked ? "Hide" : "Show"} fylker
      </label>
    </div>
  );
}
