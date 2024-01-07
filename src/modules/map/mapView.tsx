import React, { MutableRefObject, useContext, useEffect, useRef } from "react";
import { MapContext } from "./mapContextProvider";

export function MapView() {
  const { map } = useContext(MapContext);
  const mapRef = useRef() as MutableRefObject<HTMLDivElement>;
  useEffect(() => map.setTarget(mapRef.current), []);
  return <main ref={mapRef}></main>;
}
