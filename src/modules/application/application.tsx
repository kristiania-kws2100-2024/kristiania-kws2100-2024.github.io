import React, { MutableRefObject, useEffect, useMemo, useRef } from "react";
import { Map, View } from "ol";
import TileLayer from "ol/layer/Tile";
import { OSM } from "ol/source";
import { useGeographic } from "ol/proj";

useGeographic();

export function Application() {
  const ref = useRef() as MutableRefObject<HTMLDivElement>;
  const map = useMemo(() => {
    return new Map({
      layers: [new TileLayer({ source: new OSM() })],
      view: new View({ center: [10, 60], zoom: 8 }),
    });
  }, []);
  useEffect(() => {
    map.setTarget(ref.current);
  }, []);
  return <div ref={ref} style={{ height: "100vh", width: "100%" }}></div>;
}
