import React from "react";
import { MapContextProvider } from "../map/mapContext";
import { MapView } from "../map/mapView";
import { MapNav } from "../map/mapNav";

import "./application.css";
import "ol/ol.css";

export function Application() {
  return (
    <MapContextProvider>
      <header>
        <h1>Kristiania map</h1>
      </header>
      <MapNav />
      <main>
        <MapView />
      </main>
    </MapContextProvider>
  );
}
