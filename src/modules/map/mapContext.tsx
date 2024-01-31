import React, { Dispatch, SetStateAction } from "react";
import { Layer } from "ol/layer";

export const MapContext = React.createContext<{
  setLayers: Dispatch<SetStateAction<Layer[]>>;
}>({
  setLayers: () => {},
});
