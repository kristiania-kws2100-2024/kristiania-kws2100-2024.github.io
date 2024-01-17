import React, { MutableRefObject, useEffect, useRef } from "react";

import { Map, View } from "ol";
import TileLayer from "ol/layer/Tile";
import { OSM } from "ol/source";
import { useGeographic } from "ol/proj";

import "./application.css";
import "ol/ol.css";
import { KommuneLayerCheckbox } from "../kommune/kommuneLayerCheckbox";

useGeographic();

const map = new Map({
  layers: [
    new TileLayer({
      source: new OSM(),
    }),
  ],
  view: new View({
    center: [10, 59],
    zoom: 8,
  }),
});

export function MapApplication() {
  const mapRef = useRef() as MutableRefObject<HTMLDivElement>;

  useEffect(() => {
    map.setTarget(mapRef.current);
  }, []);

  return (
    <>
      <header>
        <h1>Map Application</h1>
      </header>
      <nav>
        <KommuneLayerCheckbox />
      </nav>
      <main ref={mapRef}></main>
    </>
  );
}
