import { Map, View } from "ol";
import React, { Dispatch, SetStateAction } from "react";
import { Layer } from "ol/layer";
import { useGeographic } from "ol/proj";

useGeographic();

export const map = new Map({
  view: new View({ center: [10, 61], zoom: 7 }),
});
export const MapContext = React.createContext<{
  map: Map;
  layers: Layer[];
  setLayers: Dispatch<SetStateAction<Layer[]>>;
}>({
  map,
  layers: [],
  setLayers: () => {},
});
