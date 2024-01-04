import React, { useEffect, useMemo, useState } from "react";
import { Map, View } from "ol";
import TileLayer from "ol/layer/Tile";
import { OSM } from "ol/source";
import { useGeographic } from "ol/proj";
import { MapView } from "./MapView.tsx";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { GeoJSON } from "ol/format";

useGeographic();

const defaultView = {
  center: [10.5, 60],
  zoom: 10,
};

function App() {
  const [showCounties, setShowCounties] = useState(false);
  const countiesLayer = useMemo(
    () =>
      new VectorLayer({
        source: new VectorSource({
          url: "/kommuner.json",
          format: new GeoJSON(),
        }),
      }),
    [],
  );
  const map = useMemo(() => new Map({ view: new View(defaultView) }), []);
  const backgroundLayer = useMemo(
    () => new TileLayer({ source: new OSM() }),
    [],
  );
  const layers = useMemo(
    () => [backgroundLayer, ...(showCounties ? [countiesLayer] : [])],
    [showCounties],
  );
  useEffect(() => map.setLayers(layers), [layers]);

  function handleCenter(e: React.MouseEvent) {
    e.preventDefault();
    navigator.geolocation.getCurrentPosition((pos) => {
      const { longitude, latitude } = pos.coords;
      const center = [longitude, latitude];
      map.getView().animate({ center, zoom: 14 });
    });
  }

  function handleResetView(e: React.MouseEvent) {
    e.preventDefault();
    map.getView().animate(defaultView);
  }

  function handleToggleCounties(e: React.MouseEvent) {
    e.preventDefault();
    setShowCounties((old) => !old);
  }

  return (
    <>
      <header>
        <h1>Kristiania map</h1>
      </header>
      <nav>
        <a href="#" onClick={handleCenter}>
          Center on my location
        </a>
        <a href="#" onClick={handleResetView}>
          Reset zoom
        </a>
        <a href="#" onClick={handleToggleCounties}>
          {showCounties ? "Hide counties" : "Show counties"}
        </a>
      </nav>
      <MapView map={map} />
    </>
  );
}

export default App;
