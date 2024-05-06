import * as React from "react";
import { MutableRefObject, useEffect, useMemo, useRef, useState } from "react";

import { Map, View } from "ol";
import TileLayer from "ol/layer/Tile";
import { OSM, WMTS } from "ol/source";
import { useGeographic } from "ol/proj";

import "ol/ol.css";

import "./application.css";
import { Layer } from "ol/layer";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { GeoJSON, WMTSCapabilities } from "ol/format";
import { unByKey } from "ol/Observable";
import { Fill, Style } from "ol/style";
import CircleStyle from "ol/style/Circle";
import { optionsFromCapabilities } from "ol/source/WMTS";

useGeographic();

const osmLayer = new TileLayer({ source: new OSM() });

const photoLayer = new TileLayer();

const parser = new WMTSCapabilities();
async function loadWtmsSource(
  url: string,
  config: { matrixSet: string; layer: string },
) {
  const res = await fetch(url);
  const text = await res.text();
  const result = parser.read(text);
  return new WMTS(optionsFromCapabilities(result, config)!);
}
async function loadPhotoLayer() {
  return await loadWtmsSource(
    "https://opencache.statkart.no/gatekeeper/gk/gk.open_nib_web_mercator_wmts_v2?SERVICE=WMTS&REQUEST=GetCapabilities",
    {
      layer: "Nibcache_web_mercator_v2",
      matrixSet: "default028mm",
    },
  );
}
loadPhotoLayer().then((source) => photoLayer.setSource(source));

const shelterLayer = new VectorLayer({
  source: new VectorSource({
    url: "/geojson/shelters.json",
    format: new GeoJSON(),
  }),
  style: (feature) => {
    const radius = 10 + feature.getProperties().plasser / 400;
    return new Style({
      image: new CircleStyle({
        radius,
        fill: new Fill({ color: "green" }),
      }),
    });
  },
});
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

  const [activeFeatures, setActiveFeatures] = useState<object[]>([]);

  const [showShelters, setShowShelters] = useState(false);
  useEffect(() => {
    if (showShelters) {
      setFeatureLayers((old) => [...old, shelterLayer]);
    } else {
      setFeatureLayers((old) => old.filter((l) => l !== shelterLayer));
    }

    const key = map.on("pointermove", (e) => {
      const features = map.getFeaturesAtPixel(e.pixel, {
        layerFilter: (l) => l === shelterLayer,
      });
      setActiveFeatures(features.map((f) => f.getProperties().adresse));
    });
    return () => unByKey(key);
  }, [showShelters]);

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
        {activeFeatures.length ? JSON.stringify(activeFeatures) : null}
      </footer>
    </>
  );
}
