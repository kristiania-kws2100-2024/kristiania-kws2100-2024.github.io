import * as React from "react";
import { MutableRefObject, useEffect, useMemo, useRef, useState } from "react";

import { Map, View } from "ol";
import TileLayer from "ol/layer/Tile";
import { OSM } from "ol/source";
import { useGeographic } from "ol/proj";

import "ol/ol.css";

import "./application.css";
import { Layer } from "ol/layer";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { GeoJSON } from "ol/format";

useGeographic();

const osmLayer = new TileLayer({ source: new OSM() });
const shelterLayer = new VectorLayer({
  source: new VectorSource({
    url: "/geojson/shelters.json",
    format: new GeoJSON(),
  }),
});

const map = new Map({
  view: new View({ center: [10, 60], zoom: 9 }),
});

export function Application() {
  const mapRef = useRef() as MutableRefObject<HTMLDivElement>;
  useEffect(() => map.setTarget(mapRef.current), []);

  const [featureLayers, setFeatureLayers] = useState<Layer[]>([]);

  const layers = useMemo(() => [osmLayer, ...featureLayers], [featureLayers]);
  useEffect(() => map.setLayers(layers), [layers]);

  const [showShelters, setShowShelters] = useState(false);
  useEffect(() => {
    if (showShelters) {
      setFeatureLayers((old) => [...old, shelterLayer]);
    } else {
      setFeatureLayers((old) => old.filter((l) => l !== shelterLayer));
    }
  }, [showShelters]);

  return (
    <>
      <header>
        <h1>OpenLayers demo</h1>
      </header>
      <nav>
        <label>
          <input
            type={"checkbox"}
            checked={showShelters}
            onChange={(e) => setShowShelters(e.target.checked)}
          />
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
