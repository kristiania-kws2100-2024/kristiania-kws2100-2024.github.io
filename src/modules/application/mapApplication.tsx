import React, { useMemo } from "react";

import "./application.css";
import { MapView } from "../map/mapView";
import { Map, View } from "ol";
import TileLayer from "ol/layer/Tile";
import { OSM } from "ol/source";
import { useGeographic } from "ol/proj";
import "ol/ol.css";

useGeographic();

export function MapApplication() {
  const map = useMemo(
    () =>
      new Map({
        layers: [new TileLayer({ source: new OSM() })],
        view: new View({ center: [10, 60], zoom: 8 }),
      }),
    [],
  );
  return (
    <>
      <header>
        <h1>Kristiania Map Application</h1>
      </header>
      <nav>
        <a href={"#"}>Zoom to me</a>
      </nav>
      <MapView map={map} />
    </>
  );
}
