import { Map, View } from "ol";
import { useGeographic } from "ol/proj";

import "ol/ol.css";
import React, { MutableRefObject, useEffect, useMemo, useRef } from "react";
import { MapboxVectorLayer } from "ol-mapbox-style";
import { useVehicleLayer } from "./useVehicleLayer";

useGeographic();

const map = new Map({
  view: new View({
    center: [8, 58.2],
    zoom: 9,
  }),
});

const backgroundLayer = new MapboxVectorLayer({
  styleUrl: "mapbox://styles/mapbox/dark-v11",
  accessToken:
    "pk.eyJ1Ijoiamhhbm5lcyIsImEiOiJjbHVmaHJxcnAwczVyMmpvYzB2aXh6bDI5In0.lrAcWw8waJKbUNyBF8Vzqw",
});

export function VehicleMap() {
  const vehicleLayer = useVehicleLayer();

  const mapRef = useRef() as MutableRefObject<HTMLDivElement>;
  const layers = useMemo(
    () => [backgroundLayer, vehicleLayer],
    [backgroundLayer, vehicleLayer],
  );
  useEffect(() => map.setTarget(mapRef.current), [mapRef]);
  useEffect(() => map.setLayers(layers), [layers]);
  return <div ref={mapRef} />;
}
