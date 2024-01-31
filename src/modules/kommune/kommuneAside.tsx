import React, { useContext } from "react";
import { MapContext } from "../map/mapContext";

export function KommuneAside() {
  const { layers } = useContext(MapContext);

  const kommuneLayer = layers.find((l) => l.getClassName() === "kommuner");

  return (
    <aside className={kommuneLayer ? "visible" : "hidden"}>
      <div>
        <h2>Kommuner</h2>
      </div>
    </aside>
  );
}
