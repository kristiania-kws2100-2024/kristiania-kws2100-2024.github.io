import * as React from "react";
import { MutableRefObject, useEffect, useRef } from "react";

import { Map, View } from "ol";
import TileLayer from "ol/layer/Tile";
import { OSM } from "ol/source";
import { useGeographic } from "ol/proj";

import "ol/ol.css";

import "./application.css";

useGeographic();

const map = new Map({
  layers: [new TileLayer({ source: new OSM() })],
  view: new View({ center: [10, 60], zoom: 9 }),
});

export function Application() {
  const mapRef = useRef() as MutableRefObject<HTMLDivElement>;
  useEffect(() => map.setTarget(mapRef.current), []);

  return (
    <>
      <header>
        <h1>OpenLayers demo</h1>
      </header>
      <nav>
        <label>
          <input type={"checkbox"} />
          Show shelters
        </label>
        <label>
          <input type={"checkbox"} />
          Show kommuner
        </label>
        <label>
          Background map:
          <select>
            <option>Open Street Map</option>
            <option>Norge i bilder</option>
          </select>
        </label>
      </nav>
      <div className={"map"} ref={mapRef}></div>
      <footer>Current focus:</footer>
    </>
  );
}
