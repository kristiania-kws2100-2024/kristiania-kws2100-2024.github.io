import { Map, View } from "ol";
import TileLayer from "ol/layer/Tile";
import { OSM } from "ol/source";
import React, { MutableRefObject, useEffect, useMemo, useRef } from "react";
import { useGeographic } from "ol/proj";
import { MapboxVectorLayer } from "ol-mapbox-style";

import "ol/ol.css";
import { useVehicleLayer } from "./useVehicleLayer";

import "./app.css";
import { Draw } from "ol/interaction";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { Circle, Fill, Icon, Stroke, Style } from "ol/style";

useGeographic();

const openStreetMapLayer = new TileLayer({ source: new OSM() });
const vectorTileLayer = new MapboxVectorLayer({
  styleUrl: "mapbox://styles/mapbox/dark-v9",
  accessToken:
    "pk.eyJ1Ijoiamhhbm5lcyIsImEiOiJjbHV0dThuaDkwMzN3MmpsaW16dHltZGtnIn0.qUyFwcqanRPBh1O4SF9kQA",
});

const map = new Map({
  view: new View({ center: [10, 63], zoom: 8 }),
});

const drawingSource = new VectorSource();
const drawingLayer = new VectorLayer({
  source: drawingSource,
});

const trainStationStyle = [
  new Style({
    image: new Circle({
      fill: new Fill({ color: "white" }),
      stroke: new Stroke({ color: "black", width: 2 }),
      radius: 20,
    }),
  }),
  new Style({
    image: new Icon({ src: "/icons/subway.svg" }),
  }),
];

const ferryStyle = [
  new Style({
    image: new Circle({
      fill: new Fill({ color: "lightblue" }),
      stroke: new Stroke({ color: "black", width: 2 }),
      radius: 20,
    }),
  }),
  new Style({
    image: new Icon({ src: "/icons/directions_boat.svg" }),
  }),
];

export function TransitMapApplication() {
  const { vehicleLayer, vehicleTrailLayer } = useVehicleLayer();
  const layers = useMemo(
    () => [vectorTileLayer, vehicleTrailLayer, vehicleLayer, drawingLayer],
    [vehicleLayer, vehicleLayer],
  );
  useEffect(() => map.setLayers(layers), [layers]);

  const mapRef = useRef() as MutableRefObject<HTMLDivElement>;
  useEffect(() => {
    map.setTarget(mapRef.current);
  }, []);

  function handleClickAddStation() {
    const draw = new Draw({ type: "Point", source: drawingSource });
    map.addInteraction(draw);
    drawingSource.once("addfeature", (event) => {
      map.removeInteraction(draw);
      event.feature?.setStyle(trainStationStyle);
    });
  }

  function handleClickAddFerry() {
    const draw = new Draw({ type: "Point", source: drawingSource });
    map.addInteraction(draw);
    drawingSource.once("addfeature", (event) => {
      map.removeInteraction(draw);
      event.feature?.setStyle(ferryStyle);
    });
  }

  return (
    <>
      <header>
        <button onClick={handleClickAddStation}>Add train station</button>
        <button onClick={handleClickAddFerry}>
          <span className="material-symbols-outlined">directions_boat</span>
          Add ferry
        </button>
        <button>Add circle</button>
      </header>
      <div ref={mapRef}></div>
    </>
  );
}
