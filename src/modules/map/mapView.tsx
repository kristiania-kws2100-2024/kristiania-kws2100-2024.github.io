import React, { MutableRefObject, useContext, useEffect, useRef } from "react";
import { MapContext } from "./mapContext";

export function MapView() {
  const { map } = useContext(MapContext);
  const ref = useRef() as MutableRefObject<HTMLDivElement>;
  useEffect(() => {
    map.setTarget(ref.current);
  }, []);
  return <div ref={ref}></div>;
}
