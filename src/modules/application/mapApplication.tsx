import React, { useMemo, useState } from "react";

import "./application.css";
import { MapView } from "../map/mapView";
import { Map, View } from "ol";
import TileLayer from "ol/layer/Tile";
import { OSM } from "ol/source";
import { useGeographic } from "ol/proj";
import "ol/ol.css";
import { KommuneLayerCheckbox } from "../kommune/kommuneLayerCheckbox";
import { Layer } from "ol/layer";

useGeographic();

export function MapApplication() {
  const [layers, setLayers] = useState<Layer[]>([
    new TileLayer({ source: new OSM() }),
  ]);
  const map = useMemo(
    () =>
      new Map({
        layers,
        view: new View({ center: [10, 60], zoom: 8 }),
      }),
    [layers],
  );
  return (
    <>
      <header>
        <h1>Kristiania Map Application</h1>
      </header>
      <nav>
        <a href={"#"}>Zoom to me</a>
        <KommuneLayerCheckbox setLayers={setLayers} />
      </nav>
      <MapView map={map} />
    </>
  );
}
