import React, { useState } from "react";
import { useLayer } from "../map/useLayer";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { GeoJSON } from "ol/format";
import { Circle, Fill, Stroke, Style } from "ol/style";
import { Feature } from "ol";
import { Point } from "ol/geom";
import { FeatureLike } from "ol/Feature";

const schoolLayer = new VectorLayer({
  source: new VectorSource({
    url: "/schools.json",
    format: new GeoJSON(),
  }),
  style: schoolStyle,
});

interface SchoolProperties {
  antall_elever: number;
}

type SchoolFeature = { getProperties(): SchoolProperties } & Feature<Point>;

function schoolStyle(f: FeatureLike) {
  const feature = f as SchoolFeature;
  return new Style({
    image: new Circle({
      stroke: new Stroke({ color: "white", width: 2 }),
      fill: new Fill({ color: "blue" }),
      radius: 3 + feature.getProperties().antall_elever / 150,
    }),
  });
}

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
