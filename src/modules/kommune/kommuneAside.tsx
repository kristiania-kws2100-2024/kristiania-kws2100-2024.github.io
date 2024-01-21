import { Layer } from "ol/layer";
import React, { useMemo } from "react";

export function KommuneAside({ layers }: { layers: Layer[] }) {
  const kommuneLayer = useMemo(
    () => layers.find((l) => l.getClassName() === "kommuner"),
    [layers],
  );
  return (
    <aside className={kommuneLayer ? "show" : ""}>
      <div>
        <h2>Kommuner</h2>
      </div>
    </aside>
  );
}
