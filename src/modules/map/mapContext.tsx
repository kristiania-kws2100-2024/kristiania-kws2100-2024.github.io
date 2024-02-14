import React, { Dispatch, SetStateAction } from "react";
import { Layer } from "ol/layer";
import { Map, View } from "ol";
import { useGeographic } from "ol/proj";

useGeographic();

export const map = new Map({
  view: new View({ center: [10, 59], zoom: 8 }),
});

export const MapContext = React.createContext<{
  map: Map;
  setVectorLayers: Dispatch<SetStateAction<Layer[]>>;
  vectorLayers: Layer[];
  setBaseLayer: (layer: Layer) => void;
}>({
  map,
  setVectorLayers: () => {},
  vectorLayers: [],
  setBaseLayer: () => {},
});
