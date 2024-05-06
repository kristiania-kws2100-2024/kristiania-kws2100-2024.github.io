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
import { useShelterLayer } from "../map/shelterLayer";
import { photoLayer } from "../map/photoLayer";
import { useFeatureLayer } from "../map/useFeatureLayer";

useGeographic();

const osmLayer = new TileLayer({ source: new OSM() });

const kommuneLayer = new VectorLayer({
  source: new VectorSource({ url: "/api/kommuner", format: new GeoJSON() }),
});

const map = new Map({
  view: new View({ center: [10, 60], zoom: 9 }),
});

export function Application() {
  const mapRef = useRef() as MutableRefObject<HTMLDivElement>;
  useEffect(() => map.setTarget(mapRef.current), []);

  const [featureLayers, setFeatureLayers] = useState<Layer[]>([]);

  const [backgroundLayerName, setBackgroundLayerName] = useState("osm");
  const backgroundLayer = useMemo(
    () => (backgroundLayerName === "osm" ? osmLayer : photoLayer),
    [backgroundLayerName],
  );

  const layers = useMemo(
    () => [backgroundLayer, ...featureLayers],
    [backgroundLayer, featureLayers],
  );
  useEffect(() => map.setLayers(layers), [layers]);

  const [showShelters, setShowShelters] = useState(false);
  const { activeShelterFeatures } = useShelterLayer(
    map,
    setFeatureLayers,
    showShelters,
  );

  const [showKommuneLayer, setShowKommuneLayer] = useState(false);
  useFeatureLayer(setFeatureLayers, kommuneLayer, showKommuneLayer);

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
          <input
            type={"checkbox"}
            checked={showKommuneLayer}
            onChange={(e) => setShowKommuneLayer(e.target.checked)}
          />
          Show kommuner
        </label>
        <label>
          Background map ({backgroundLayerName}):
          <select
            value={backgroundLayerName}
            onChange={(e) => setBackgroundLayerName(e.target.value)}
          >
            <option value={"osm"}>Open Street Map</option>
            <option value={"photo"}>Norge i bilder</option>
          </select>
        </label>
      </nav>
      <div className={"map"} ref={mapRef}></div>
      <footer>
        {activeShelterFeatures.length
          ? JSON.stringify(
              activeShelterFeatures.map((f) => f.getProperties().adresse),
            )
          : null}
      </footer>
    </>
  );
}
