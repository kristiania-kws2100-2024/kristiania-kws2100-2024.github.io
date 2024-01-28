import React, { useContext, useEffect, useMemo, useState } from "react";
import { MapContext } from "../map/mapContext";

import { KommuneFeature, KommuneLayer } from "./kommuneLayer";
import { useViewExtent } from "../map/useViewExtent";
import { getStedsnavn } from "../sted/stedsNavn";

export function KommuneAside() {
  const { layers } = useContext(MapContext);
  const viewExtent = useViewExtent();
  const layer = useMemo(
    () => layers.find((l) => l.getClassName() === "kommuner") as KommuneLayer,
    [layers],
  );
  const [features, setFeatures] = useState<KommuneFeature[]>([]);
  const visibleFeatures = useMemo(() => {
    return features.filter((f) =>
      f.getGeometry()?.intersectsExtent(viewExtent),
    );
  }, [features, viewExtent]);
  function loadFeatures() {
    setFeatures(layer?.getSource()?.getFeatures() || []);
  }
  useEffect(() => {
    layer?.on("change", loadFeatures);
    loadFeatures();
    return () => {
      layer?.un("change", loadFeatures);
      setFeatures([]);
    };
  }, [layer]);

  return (
    <aside className={layer ? "show" : "hide"}>
      <div>
        <h2>{visibleFeatures.length} Kommuner</h2>
        {visibleFeatures.map((k) => (
          <div key={k.getProperties().kommunenummer}>
            {getStedsnavn(k.getProperties())}
          </div>
        ))}
      </div>
    </aside>
  );
}
