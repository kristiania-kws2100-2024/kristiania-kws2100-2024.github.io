import React, { MutableRefObject, useEffect, useRef } from "react";
import "./application.css";

import { Map, View } from "ol";
import TileLayer from "ol/layer/Tile";
import { OSM } from "ol/source";
import { useGeographic } from "ol/proj";

useGeographic();

const map = new Map({
  view: new View({ center: [10.5, 60], zoom: 10 }),
  layers: [new TileLayer({ source: new OSM() })],
});

export function Application() {
  const mapRef = useRef() as MutableRefObject<HTMLDivElement>;
  useEffect(() => map.setTarget(mapRef.current), []);
  return <main ref={mapRef}></main>;
}
