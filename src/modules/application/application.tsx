import React, {
  MutableRefObject,
  ReactNode,
  useContext,
  useEffect,
  useRef,
} from "react";
import "./application.css";

import { Map, View } from "ol";
import TileLayer from "ol/layer/Tile";
import { OSM } from "ol/source";
import { useGeographic } from "ol/proj";
import "ol/ol.css";

useGeographic();

const map = new Map({
  view: new View({ center: [10.5, 60], zoom: 10 }),
  layers: [new TileLayer({ source: new OSM() })],
});

const MapContext = React.createContext({ map });

function MapContextProvider({ children }: { children: ReactNode }) {
  return <MapContext.Provider value={{ map }}>{children}</MapContext.Provider>;
}

export function Application() {
  return (
    <MapContextProvider>
      <MapView />
    </MapContextProvider>
  );
}

export function MapView() {
  const { map } = useContext(MapContext);
  const mapRef = useRef() as MutableRefObject<HTMLDivElement>;
  useEffect(() => map.setTarget(mapRef.current), []);
  return <main ref={mapRef}></main>;
}
