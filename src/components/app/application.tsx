import * as React from "react";
import { Map, View } from "ol";
import { useGeographic } from "ol/proj";
import TileLayer from "ol/layer/Tile";
import { OSM } from "ol/source";
import { MutableRefObject, useEffect, useRef } from "react";

useGeographic();
const map = new Map({
  view: new View({ center: [10, 60], zoom: 8 }),
  layers: [new TileLayer({ source: new OSM() })],
});

export function Application() {
  const mapRef = useRef() as MutableRefObject<HTMLDivElement>;
  useEffect(() => map.setTarget(mapRef.current), []);
  return <div ref={mapRef}></div>;
}
