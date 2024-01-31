import React, { MutableRefObject, useEffect, useRef, useState } from "react";
import { Map, View } from "ol";
import TileLayer from "ol/layer/Tile";
import { OSM } from "ol/source";
import { useGeographic } from "ol/proj";

import "./application.css";
import "ol/ol.css";
import { KommuneLayerCheckbox } from "../kommune/kommuneLayerCheckbox";
import { MapContext } from "../map/mapContext";
import { Layer } from "ol/layer";
import { KommuneAside } from "../kommune/kommuneAside";

useGeographic();

const map = new Map({
  view: new View({ center: [10, 59], zoom: 8 }),
});

export function Application() {
  function handleFocusUser(e: React.MouseEvent) {
    e.preventDefault();
    navigator.geolocation.getCurrentPosition((pos) => {
      const { latitude, longitude } = pos.coords;
      map.getView().animate({
        center: [longitude, latitude],
        zoom: 10,
      });
    });
  }

  const [layers, setLayers] = useState<Layer[]>([
    new TileLayer({ source: new OSM() }),
  ]);
  useEffect(() => map.setLayers(layers), [layers]);

  const mapRef = useRef() as MutableRefObject<HTMLDivElement>;
  useEffect(() => map.setTarget(mapRef.current), []);
  return (
    <MapContext.Provider value={{ layers, setLayers }}>
      <header>
        <h1>Kommune kart</h1>
      </header>
      <nav>
        <a href={"#"} onClick={handleFocusUser}>
          Focus on me
        </a>
        <KommuneLayerCheckbox />
      </nav>
      <main>
        <div ref={mapRef}></div>
        <KommuneAside />
      </main>
    </MapContext.Provider>
  );
}
