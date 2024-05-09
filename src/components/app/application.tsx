import * as React from "react";

import { Map, View } from "ol";

import "./application.css";
import TileLayer from "ol/layer/Tile";
import { OSM } from "ol/source";
import { MutableRefObject, useEffect, useMemo, useRef, useState } from "react";
import { useGeographic } from "ol/proj";

import "ol/ol.css";
import { Layer } from "ol/layer";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { GeoJSON } from "ol/format";
import { Circle, Fill, Style } from "ol/style";
import { FeatureLike } from "ol/Feature";

useGeographic();
const map = new Map({
  view: new View({ center: [10, 60], zoom: 9 }),
});

const openStreetMapLayer = new TileLayer({
  source: new OSM(),
});
const shelterLayer = new VectorLayer({
  source: new VectorSource({
    url: "/geojson/shelters.json",
    format: new GeoJSON(),
  }),
  style: (feature) => {
    const radius = 6 + feature.getProperties().plasser / 500;
    return new Style({
      image: new Circle({ radius, fill: new Fill({ color: "blue" }) }),
    });
  },
});

const kommuneLayer = new VectorLayer({
  source: new VectorSource({
    url: "/api/kommuner",
    format: new GeoJSON(),
  }),
});

export function Application() {
  const mapRef = useRef() as MutableRefObject<HTMLDivElement>;
  useEffect(() => map.setTarget(mapRef.current), []);

  const [featureLayers, setFeatureLayers] = useState<Layer[]>([]);

  const layers = useMemo(
    () => [openStreetMapLayer, ...featureLayers],
    [featureLayers],
  );

  useEffect(() => map.setLayers(layers), [layers]);

  const [activeShelterFeatures, setActiveShelterFeatures] = useState<
    FeatureLike[]
  >([]);
  const [showShelterLayer, setShowShelterLayer] = useState(false);
  useEffect(() => {
    if (showShelterLayer) {
      setFeatureLayers((old) => [...old, shelterLayer]);
    } else {
      setFeatureLayers((old) => old.filter((l) => l !== shelterLayer));
    }
    map.on("pointermove", (e) => {
      setActiveShelterFeatures(map.getFeaturesAtPixel(e.pixel));
    });
  }, [showShelterLayer]);

  const [showKommuneLayer, setShowKommuneLayer] = useState(false);
  useEffect(() => {
    if (showKommuneLayer) {
      setFeatureLayers((old) => [...old, kommuneLayer]);
    } else {
      setFeatureLayers((old) => old.filter((l) => l !== kommuneLayer));
    }
  }, [showKommuneLayer]);

  return (
    <>
      <header>
        <h1>OpenLayers demo</h1>
      </header>
      <nav>
        <label>
          <input
            type={"checkbox"}
            checked={showShelterLayer}
            onChange={(e) => setShowShelterLayer(e.target.checked)}
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
          Background map:
          <select>
            <option>Open Street Map</option>
            <option>Norge i bilder</option>
          </select>
        </label>
      </nav>
      <div className={"map"} ref={mapRef}></div>
      <footer>
        Current focus: {activeShelterFeatures[0]?.getProperties().adresse}
      </footer>
    </>
  );
}
