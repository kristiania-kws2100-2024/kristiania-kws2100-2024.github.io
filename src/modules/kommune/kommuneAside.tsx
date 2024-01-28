import React, { useContext, useEffect, useMemo, useState } from "react";
import { MapContext } from "../map/mapContext";

import { KommuneFeature, KommuneLayer } from "./kommuneLayer";
import { useViewExtent } from "../map/useViewExtent";

export function KommuneAside() {
  const { layers } = useContext(MapContext);
  const viewExtent = useViewExtent();
  const kommuneLayer = useMemo(
    () => layers.find((l) => l.getClassName() === "kommuner") as KommuneLayer,
    [layers],
  );
  const [kommuner, setKommuner] = useState<KommuneFeature[]>([]);
  const visibleFeatures = useMemo(() => {
    return kommuner.filter((f) =>
      f.getGeometry()?.intersectsExtent(viewExtent),
    );
  }, [kommuner, viewExtent]);
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
        <h2>{visibleFeatures.length} Kommuner</h2>
        {visibleFeatures.map((k) => (
          <div key={k.getProperties().kommunenummer}>
            {k.getProperties().navn.find((n) => n.sprak === "nor")!.navn}
          </div>
        ))}
      </div>
    </aside>
  );
}
