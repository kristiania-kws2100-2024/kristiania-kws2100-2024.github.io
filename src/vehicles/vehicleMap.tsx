import { Map, MapBrowserEvent, View } from "ol";
import { MVT } from "ol/format";
import VectorTileLayer from "ol/layer/VectorTile";
import VectorTileSource from "ol/source/VectorTile";
import { useGeographic } from "ol/proj";
import React, { MutableRefObject, useEffect, useMemo, useRef } from "react";

import "ol/ol.css";
import { MapboxVectorLayer } from "ol-mapbox-style";
import VectorLayer from "ol/layer/Vector";
import { Circle, Fill, Stroke, Style, Text } from "ol/style";
import { FeatureLike } from "ol/Feature";
import {
  useVehicles,
  VehicleProperties,
  VehiclePropertiesWithHistory,
} from "./vehicleStateProvider";

useGeographic();
const ahocevarLayer = new VectorTileLayer({
  source: new VectorTileSource({
    format: new MVT(),
    url: "https://ahocevar.com/geoserver/gwc/service/tms/1.0.0/ne:ne_10m_admin_0_countries@EPSG%3A900913@pbf/{z}/{x}/{-y}.pbf",
    maxZoom: 14,
  }),
});

const layer = new MapboxVectorLayer({
  // or, instead of the above, try
  styleUrl: "mapbox://styles/mapbox/dark-v11",
  accessToken:
    "pk.eyJ1Ijoiamhhbm5lcyIsImEiOiJjbHVmaHJxcnAwczVyMmpvYzB2aXh6bDI5In0.lrAcWw8waJKbUNyBF8Vzqw",
});
const map = new Map({
  view: new View({
    center: [10, 65],
    zoom: 5,
  }),
});

function vehicleStyle(feature: FeatureLike) {
  const props = feature.getProperties() as VehiclePropertiesWithHistory;
  return [
    new Style({
      image: new Circle({
        radius: 4,
        fill: new Fill({ color: "red" }),
      }),
    }),
    new Style({
      text: new Text({
        text: props.routeId,
        font: "bold 14px sans-serif",
        stroke: new Stroke({ color: "white" }),
        fill: new Fill({ color: "black" }),
        offsetY: -10,
      }),
    }),
    new Style({
      text: new Text({
        text: `${props.history.length} updates`,
        font: "bold 14px sans-serif",
        stroke: new Stroke({ color: "white" }),
        fill: new Fill({ color: "black" }),
        offsetY: 10,
      }),
    }),
  ];
}

export function VehicleMap({ vehicle }: { vehicle?: VehicleProperties }) {
  const { vehicleSource, vehicleTrackSource } = useVehicles();
  const layers = useMemo(
    () => [
      layer,
      new VectorLayer({ source: vehicleTrackSource }),
      new VectorLayer({ source: vehicleSource, style: vehicleStyle }),
    ],
    [layer, vehicleSource],
  );
  const mapRef = useRef() as MutableRefObject<HTMLDivElement>;
  useEffect(() => map.setTarget(mapRef.current), []);
  useEffect(() => map.setLayers(layers), [layers]);
  useEffect(() => {
    navigator.geolocation.getCurrentPosition((res) => {
      const { latitude, longitude } = res.coords;
      const center = [longitude, latitude];
      map.getView().animate({ center, zoom: 12 });
    });
  }, []);
  useEffect(() => {
    if (vehicle) {
      map.getView().animate({ center: vehicle.geometry.coordinates, zoom: 14 });
    }
  }, [vehicle]);
  function onClick(e: MapBrowserEvent<MouseEvent>) {}
  useEffect(() => {
    map.on("click", onClick);
    return () => map.un("click", onClick);
  }, [map, layers]);
  return <div ref={mapRef} />;
}
