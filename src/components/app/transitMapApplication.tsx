import { Map, View } from "ol";
import TileLayer from "ol/layer/Tile";
import { OSM } from "ol/source";
import React, { MutableRefObject, useEffect, useMemo, useRef } from "react";
import { useGeographic } from "ol/proj";

import "./app.css";

import "ol/ol.css";
import { useVehicleLayer } from "./useVehicleLayer";
import { DrawTrainStationButton } from "./drawTrainStationButton";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { DrawFerryButton } from "./drawFerryButton";
import { DrawCircleButton } from "./drawCircleButton";

useGeographic();

const drawingSource = new VectorSource();
const drawingLayer = new VectorLayer({ source: drawingSource });

const backgroundLayer = new TileLayer({ source: new OSM() });
const map = new Map({
  view: new View({ center: [10, 63], zoom: 9 }),
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
  return (
    <>
      <nav>
        <DrawTrainStationButton map={map} source={drawingSource} />
        <DrawFerryButton map={map} source={drawingSource} />
        <DrawCircleButton map={map} source={drawingSource} />
      </nav>
      <div ref={mapRef}></div>
    </>
  );
}
