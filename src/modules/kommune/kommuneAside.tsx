import React, { useContext, useMemo } from "react";
import { MapContext } from "../map/mapContext";

export function KommuneAside() {
  const { layers } = useContext(MapContext);
  const kommuneLayer = useMemo(
    () => layers.find((l) => l.getClassName() === "kommuner"),
    [layers],
  );

  return (
    <aside className={kommuneLayer ? "show" : "hide"}>
      <div>
        <h2>Kommuner</h2>
      </div>
    </aside>
  );
}
