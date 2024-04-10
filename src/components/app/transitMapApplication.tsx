import { Map, View } from "ol";
import TileLayer from "ol/layer/Tile";
import { OSM } from "ol/source";
import React, { MutableRefObject, useEffect, useMemo, useRef } from "react";
import { useGeographic } from "ol/proj";

import "ol/ol.css";
import { useVehicleLayer } from "./useVehicleLayer";

import "./app.css";
import { Draw } from "ol/interaction";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";

useGeographic();

const backgroundLayer = new TileLayer({ source: new OSM() });
const map = new Map({
  view: new View({ center: [10, 63], zoom: 8 }),
});

const drawingSource = new VectorSource();
const drawingLayer = new VectorLayer({
  source: drawingSource,
});

export function TransitMapApplication() {
  const { vehicleLayer, vehicleTrailLayer } = useVehicleLayer();
  const layers = useMemo(
    () => [backgroundLayer, vehicleTrailLayer, vehicleLayer, drawingLayer],
    [vehicleLayer, vehicleLayer],
  );
  useEffect(() => map.setLayers(layers), [layers]);

  const mapRef = useRef() as MutableRefObject<HTMLDivElement>;
  useEffect(() => {
    map.setTarget(mapRef.current);
  }, []);

  function handleClickAddStation() {
    map.addInteraction(new Draw({ type: "Polygon", source: drawingSource }));
  }

  return (
    <>
      <header>
        <button onClick={handleClickAddStation}>Add train station</button>
        <button>Add ferry</button>
        <button>Add circle</button>
      </header>
      <div ref={mapRef}></div>
    </>
  );
}
