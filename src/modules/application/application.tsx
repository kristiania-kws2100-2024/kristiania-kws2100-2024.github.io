import React from "react";
import "./application.css";
import "ol/ol.css";
import { MapContextProvider } from "../map/mapContextProvider";
import { MapView } from "../map/mapView";

export function Application() {
  return (
    <MapContextProvider>
      <MapView />
    </MapContextProvider>
  );
}
