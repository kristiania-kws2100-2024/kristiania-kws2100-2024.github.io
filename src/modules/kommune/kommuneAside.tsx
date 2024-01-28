import React, { useContext, useEffect, useMemo, useState } from "react";
import { MapContext } from "../map/mapContext";

import { KommuneLayer, KommuneFeature } from "./kommuneLayer";

export function KommuneAside() {
  const { layers } = useContext(MapContext);
  const kommuneLayer = useMemo(
    () => layers.find((l) => l.getClassName() === "kommuner") as KommuneLayer,
    [layers],
  );
  const [kommuner, setKommuner] = useState<KommuneFeature[]>([]);
  function loadKommuneFeatures() {
    setKommuner(kommuneLayer?.getSource()?.getFeatures() || []);
  }
  useEffect(() => {
    kommuneLayer?.on("change", loadKommuneFeatures);
    loadKommuneFeatures();
    return () => {
      kommuneLayer?.un("change", loadKommuneFeatures);
      setKommuner([]);
    };
  }, [kommuneLayer]);

  return (
    <aside className={kommuneLayer ? "show" : "hide"}>
      <div>
        <h2>{kommuner.length} Kommuner</h2>
        {kommuner.map((k) => (
          <div key={k.getProperties().kommunenummer}>
            {k.getProperties().navn.find((n) => n.sprak === "nor")!.navn}
          </div>
        ))}
      </div>
    </aside>
  );
}
