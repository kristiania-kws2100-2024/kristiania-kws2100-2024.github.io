import { Layer } from "ol/layer";
import TileLayer from "ol/layer/Tile";
import { OSM } from "ol/source";
import React, {
  Dispatch,
  ReactNode,
  SetStateAction,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Map, View } from "ol";
import { useGeographic } from "ol/proj";

useGeographic();

const view = new View({ center: [10, 60], zoom: 8 });
const layers: Layer[] = [new TileLayer({ source: new OSM() })];
const map = new Map({ layers, view });
const setLayers: Dispatch<SetStateAction<Layer[]>> = () => {};

export const MapContext = React.createContext({ map, view, layers, setLayers });

export function MapContextProvider({ children }: { children: ReactNode }) {
  const [layers, setLayers] = useState<Layer[]>([
    new TileLayer({ source: new OSM() }),
  ]);
  const view = useMemo(() => new View({ center: [10, 60], zoom: 8 }), []);
  const map = useMemo(() => new Map({ layers, view }), []);
  useEffect(() => map.setLayers(layers), [layers]);

  return (
    <MapContext.Provider value={{ map, view, layers, setLayers }}>
      {children}
    </MapContext.Provider>
  );
}
