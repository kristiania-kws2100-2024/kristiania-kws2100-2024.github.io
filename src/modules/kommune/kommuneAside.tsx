import React, { useContext, useEffect, useMemo } from "react";
import { MapContext } from "../map/mapContextProvider";

export function KommuneAside() {
  const { layers } = useContext(MapContext);
  const kommuneLayer = useMemo(
    () => layers.find((l) => l.getClassName() === "kommuner"),
    [layers],
  );
  return (
    <aside className={kommuneLayer ? "visible" : ""}>
      <div>
        <h2>Kommuner</h2>
      </div>
    </aside>
  );
}
