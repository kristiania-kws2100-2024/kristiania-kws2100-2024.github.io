import React, { useState } from "react";
import { useLayer } from "../map/useLayer";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { GeoJSON } from "ol/format";

const schoolLayer = new VectorLayer({
  source: new VectorSource({
    url: "/schools.json",
    format: new GeoJSON(),
  }),
});

export function SchoolLayerCheckbox() {
  const [checked, setChecked] = useState(true);

  useLayer(schoolLayer, checked);

  return (
    <div>
      <label>
        <input
          type={"checkbox"}
          checked={checked}
          onChange={(e) => setChecked(e.target.checked)}
        />
        Show schools
      </label>
    </div>
  );
}
