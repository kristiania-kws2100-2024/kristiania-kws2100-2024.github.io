import React from "react";
import "./application.css";
import "ol/ol.css";
import { MapContextProvider } from "../map/mapContextProvider";
import { MapView } from "../map/mapView";
import { KommuneLayerCheckbox } from "../kommune/kommuneLayerCheckbox";
import { KommuneAside } from "../kommune/kommuneAside";

export function Application() {
  return (
    <MapContextProvider>
      <header>
        <h1>Kommunekart</h1>
      </header>
      <nav>
        <a href={"#"}>Focus on me</a>
        <a href={"#"}>Show Norway</a>
        <KommuneLayerCheckbox />
      </nav>
      <main>
        <MapView />
        <KommuneAside />
      </main>
    </MapContextProvider>
  );
}
