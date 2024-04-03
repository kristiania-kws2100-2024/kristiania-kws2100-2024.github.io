import { Feature, Map, View } from "ol";
import TileLayer from "ol/layer/Tile";
import { OSM } from "ol/source";
import React, { MutableRefObject, useEffect, useMemo, useRef } from "react";
import { useGeographic } from "ol/proj";

import "ol/ol.css";
import { Point } from "ol/geom";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { useVehicles } from "./useVehicles";

useGeographic();

const backgroundLayer = new TileLayer({ source: new OSM() });
const map = new Map({
  view: new View({ center: [10, 63], zoom: 8 }),
});

export function TransitMapApplication() {
  const vehicles = useVehicles();
  const vehicleSource = useMemo(() => {
    return new VectorSource({
      features: vehicles.map((v) => new Feature(new Point(v.coordinate))),
    });
  }, [vehicles]);
  const vehicleLayer = useMemo(
    () => new VectorLayer({ source: vehicleSource }),
    [vehicleSource],
  );
  const layers = useMemo(() => [backgroundLayer, vehicleLayer], [vehicleLayer]);
  useEffect(() => map.setLayers(layers), [layers]);

  const mapRef = useRef() as MutableRefObject<HTMLDivElement>;
  useEffect(() => {
    map.setTarget(mapRef.current);
  }, []);
  return <div ref={mapRef}></div>;
}
