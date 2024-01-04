import React, { useMemo } from "react";
import { Map, View } from "ol";
import TileLayer from "ol/layer/Tile";
import { OSM } from "ol/source";
import { useGeographic } from "ol/proj";
import { MapView } from "./MapView.tsx";

useGeographic();

const defaultView = {
  center: [10.5, 60],
  zoom: 10,
};

function App() {
  const map = useMemo(
    () =>
      new Map({
        view: new View(defaultView),
        layers: [new TileLayer({ source: new OSM() })],
      }),
    [],
  );

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
      </nav>
      <MapView map={map} />
    </>
  );
}

export default App;
