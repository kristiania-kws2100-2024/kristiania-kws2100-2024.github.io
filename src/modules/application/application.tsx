import React, { MutableRefObject, useEffect, useRef } from "react";
import { Map, View } from "ol";
import TileLayer from "ol/layer/Tile";
import { OSM } from "ol/source";
import { useGeographic } from "ol/proj";

import "./application.css";
import "ol/ol.css";

useGeographic();

const map = new Map({
  layers: [new TileLayer({ source: new OSM() })],
  view: new View({ center: [10, 59], zoom: 8 }),
});

export function Application() {
  const mapRef = useRef() as MutableRefObject<HTMLDivElement>;
  useEffect(() => map.setTarget(mapRef.current), []);
  return (
    <>
      <header>
        <h1>Kommune kart</h1>
      </header>
      <nav>
        <a href={"#"}>Focus on me</a>
      </nav>
      <div ref={mapRef}></div>
    </>
  );
}
