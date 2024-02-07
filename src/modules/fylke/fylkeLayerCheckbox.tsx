import React, { useState } from "react";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { GeoJSON } from "ol/format";
import { Fill, Stroke, Style, Text } from "ol/style";
import { FylkeFeature } from "./fylkeAside";
import { useLayer } from "../map/useLayer";

const fylkeLayer = new VectorLayer({
  className: "fylker",
  source: new VectorSource({
    url: "/fylker.json",
    format: new GeoJSON(),
  }),
  style: (feature) => {
    const fylke = feature as FylkeFeature;
    const { fylkesnummer } = fylke.getProperties();
    return new Style({
      stroke: new Stroke({
        color: "red",
        width: 3,
      }),
      fill:
        fylkesnummer === "34"
          ? new Fill({
              color: [0x0, 0xff, 0x0, 0.2],
            })
          : undefined,
      text: new Text({
        stroke: new Stroke({
          color: "blue",
        }),
        text: fylkesnummer,
      }),
    });
  },
});

export function FylkeLayerCheckbox() {
  const [checked, setChecked] = useState(false);

  useLayer(fylkeLayer, checked);

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
