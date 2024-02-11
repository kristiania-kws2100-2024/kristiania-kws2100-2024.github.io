import React, { Dispatch, SetStateAction } from "react";
import { Layer } from "ol/layer";
import { Map, View } from "ol";
import { useGeographic } from "ol/proj";

useGeographic();

export const map = new Map({ view: new View({ center: [0, 0], zoom: 8 }) });

export const MapContext = React.createContext<{
  map: Map;
  setBaseLayer: (layer: Layer) => void;
  setFeatureLayers: Dispatch<SetStateAction<Layer[]>>;
  featureLayers: Layer[];
}>({
  map,
  setBaseLayer: () => {},
  setFeatureLayers: () => {},
  featureLayers: [],
});
