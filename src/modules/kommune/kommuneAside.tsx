import React, { useContext } from "react";
import { MapContext } from "../map/mapContext";

export function KommuneAside() {
  const { layers } = useContext(MapContext);

  const kommuneLayer = layers.find((l) => l.getClassName() === "kommuner");

  return (
    <aside>
      <div>
        <h2>Kommuner {kommuneLayer ? "visible" : "hidden"}</h2>
      </div>
    </aside>
  );
}
