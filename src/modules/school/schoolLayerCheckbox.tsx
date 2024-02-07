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
import { act } from "react-dom/test-utils";

const schoolLayer = new VectorLayer({
  source: new VectorSource({
    url: "/schools.json",
    format: new GeoJSON(),
  }),
  style: schoolStyle,
});

type SchoolProperties = {
  navn: string;
  antall_elever: number;
  eierforhold: "Offentlig" | "Privat";
};

type SchoolFeature = { getProperties(): SchoolProperties } & Feature<Point>;

function schoolStyle(f: FeatureLike) {
  const feature = f as SchoolFeature;
  const school = feature.getProperties();
  return new Style({
    image: new Circle({
      stroke: new Stroke({ color: "white", width: 1 }),
      fill: new Fill({
        color: school.eierforhold === "Offentlig" ? "blue" : "purple",
      }),
      radius: 3 + school.antall_elever / 150,
    }),
  });
}

function activeSchoolStyle(f: FeatureLike) {
  const feature = f as SchoolFeature;
  const school = feature.getProperties();
  return new Style({
    image: new Circle({
      stroke: new Stroke({ color: "white", width: 3 }),
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

  const [activeFeature, setActiveFeature] = useState<SchoolFeature>();

  function handlePointerMove(e: MapBrowserEvent<MouseEvent>) {
    const features: FeatureLike[] = [];
    map.forEachFeatureAtPixel(e.pixel, (f) => features.push(f), {
      hitTolerance: 5,
      layerFilter: (l) => l === schoolLayer,
    });
    if (features.length === 1) {
      setActiveFeature(features[0] as SchoolFeature);
    } else {
      setActiveFeature(undefined);
    }
  }

  useEffect(() => {
    activeFeature?.setStyle(activeSchoolStyle);
    return () => activeFeature?.setStyle(undefined);
  }, [activeFeature]);

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
