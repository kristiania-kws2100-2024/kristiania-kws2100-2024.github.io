import React, { useState } from "react";
import { useLayer } from "../map/useLayer";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { GeoJSON } from "ol/format";
import { Circle, Fill, Stroke, Style } from "ol/style";
import { FeatureLike } from "ol/Feature";
import { SchoolProperties } from "./schoolFeature";

const schoolStyle = (feature: FeatureLike) => {
  const school = feature.getProperties() as SchoolProperties;
  return new Style({
    image: new Circle({
      radius: 2 + school.antall_elever / 150,
      fill:
        school.eierforhold === "Offentlig"
          ? new Fill({ color: "blue" })
          : new Fill({ color: "purple" }),
      stroke: new Stroke({ color: "white" }),
    }),
  });
};

const schoolLayer = new VectorLayer({
  source: new VectorSource({
    url: "/skoler.json",
    format: new GeoJSON(),
  }),
  style: schoolStyle,
  className: "schools",
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
        Schools
      </label>
    </div>
  );
}
