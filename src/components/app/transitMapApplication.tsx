import { Map, View } from "ol";
import TileLayer from "ol/layer/Tile";
import { OSM } from "ol/source";
import React, { MutableRefObject, useEffect, useMemo, useRef } from "react";
import { useGeographic } from "ol/proj";

import "ol/ol.css";
import { useVehicleLayer } from "./useVehicleLayer";

useGeographic();

const backgroundLayer = new TileLayer({ source: new OSM() });
const map = new Map({
  view: new View({ center: [10, 63], zoom: 8 }),
});

export function TransitMapApplication() {
  const { vehicleLayer, vehicleTrailLayer } = useVehicleLayer();
  const layers = useMemo(
    () => [backgroundLayer, vehicleTrailLayer, vehicleLayer],
    [vehicleLayer, vehicleLayer],
  );
  useEffect(() => map.setLayers(layers), [layers]);

  const mapRef = useRef() as MutableRefObject<HTMLDivElement>;
  useEffect(() => {
    map.setTarget(mapRef.current);
  }, []);
  return <div ref={mapRef}></div>;
}
