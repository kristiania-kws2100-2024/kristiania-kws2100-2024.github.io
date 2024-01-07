import React, { ReactNode } from "react";
import { Map, View } from "ol";
import TileLayer from "ol/layer/Tile";
import { OSM } from "ol/source";
import { useGeographic } from "ol/proj";

useGeographic();
const map = new Map({
  view: new View({ center: [10.5, 60], zoom: 10 }),
  layers: [new TileLayer({ source: new OSM() })],
});
export const MapContext = React.createContext({ map });

export function MapContextProvider({ children }: { children: ReactNode }) {
  return <MapContext.Provider value={{ map }}>{children}</MapContext.Provider>;
}
