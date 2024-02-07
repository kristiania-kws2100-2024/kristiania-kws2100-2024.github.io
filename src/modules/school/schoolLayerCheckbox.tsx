import React, { useContext, useEffect, useState } from "react";
import { useLayer } from "../map/useLayer";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { GeoJSON } from "ol/format";
import { Circle, Fill, Stroke, Style } from "ol/style";
import { Feature, MapBrowserEvent } from "ol";
import { Point } from "ol/geom";
import { FeatureLike } from "ol/Feature";
import { MapContext } from "../map/mapContext";

const schoolLayer = new VectorLayer({
  source: new VectorSource({
    url: "/schools.json",
    format: new GeoJSON(),
  }),
  style: schoolStyle,
});

type SchoolProperties = {
  antall_elever: number;
  eierforhold: "Offentlig" | "Privat";
};

type SchoolFeature = { getProperties(): SchoolProperties } & Feature<Point>;

function schoolStyle(f: FeatureLike) {
  const feature = f as SchoolFeature;
  const school = feature.getProperties();
  return new Style({
    image: new Circle({
      stroke: new Stroke({ color: "white", width: 2 }),
      fill: new Fill({
        color: school.eierforhold === "Offentlig" ? "blue" : "purple",
      }),
      radius: 3 + school.antall_elever / 150,
    }),
  });
}

export function SchoolLayerCheckbox() {
  const { map } = useContext(MapContext);
  const [checked, setChecked] = useState(true);

  function handlePointerMove(e: MapBrowserEvent<MouseEvent>) {
    console.log("pointermove", e.coordinate);
    const featuresAtCoordinate = schoolLayer
      .getSource()
      ?.getClosestFeatureToCoordinate(e.coordinate);
    console.log(featuresAtCoordinate?.getProperties().navn);
  }

  useLayer(schoolLayer, checked);

  useEffect(() => {
    if (checked) {
      map?.on("pointermove", handlePointerMove);
    }
    return () => map?.un("pointermove", handlePointerMove);
  }, [checked]);

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
