import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Layer } from "ol/layer";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { GeoJSON } from "ol/format";

const kommuneLayer = new VectorLayer({
  source: new VectorSource({
    url: "/kommuner.json",
    format: new GeoJSON(),
  }),
});

export function KommuneLayerCheckbox({
  setLayers,
}: {
  setLayers: Dispatch<SetStateAction<Layer[]>>;
}) {
  const [checked, setChecked] = useState(false);
  useEffect(() => {
    if (checked) {
      setLayers((old) => [...old, kommuneLayer]);
    }
  }, [checked]);

  return (
    <div>
      <label>
        <input
          type={"checkbox"}
          checked={checked}
          onChange={(e) => setChecked(e.target.checked)}
        />
        {checked ? "Hide" : "Show"} kommune layer
      </label>
    </div>
  );
}
