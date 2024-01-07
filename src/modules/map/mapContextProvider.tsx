import React, {
  Dispatch,
  ReactNode,
  SetStateAction,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Map, View } from "ol";
import TileLayer from "ol/layer/Tile";
import { OSM } from "ol/source";
import { useGeographic } from "ol/proj";
import { Layer } from "ol/layer";

useGeographic();

const view = new View({ center: [10.5, 60], zoom: 10 });
const layers = [new TileLayer({ source: new OSM() })];
const map = new Map({ view, layers });

const setLayers: Dispatch<SetStateAction<Layer[]>> = () => {};

export const MapContext = React.createContext({ map, setLayers });

export function MapContextProvider({ children }: { children: ReactNode }) {
  const [layers, setLayers] = useState<Layer[]>(() => [
    new TileLayer({ source: new OSM() }),
  ]);
  const map = useMemo(() => {
    return new Map({ view: new View({ center: [10.5, 60], zoom: 10 }) });
  }, []);
  useEffect(() => map.setLayers(layers), [layers]);
  return (
    <MapContext.Provider value={{ map, setLayers }}>
      {children}
    </MapContext.Provider>
  );
}
