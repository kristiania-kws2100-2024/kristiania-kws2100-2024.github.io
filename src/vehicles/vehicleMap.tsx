import { Map, View } from "ol";
import { MVT } from "ol/format";
import VectorTileLayer from "ol/layer/VectorTile";
import VectorTileSource from "ol/source/VectorTile";
import { useGeographic } from "ol/proj";
import React, { MutableRefObject, useEffect, useMemo, useRef } from "react";

import "ol/ol.css";
import { MapboxVectorLayer } from "ol-mapbox-style";
import { useVehicleVectorSource } from "./useVehicleVectorSource";
import VectorLayer from "ol/layer/Vector";

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

export function VehicleMap() {
  const vehicleSource = useVehicleVectorSource();
  const layers = useMemo(
    () => [layer, new VectorLayer({ source: vehicleSource })],
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
  return <div ref={mapRef} />;
}
