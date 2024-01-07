import React, { useMemo } from "react";
import { getKommuneName, KommuneProperties } from "./kommuneProperties";
import { useViewExtent } from "../map/useViewExtent";
import { useFeatureLayer } from "../map/useFeatureLayer";

export function KommuneAside() {
  const { features, layer } = useFeatureLayer(
    (l) => l.getClassName() === "kommuner",
  );
  const viewExtent = useViewExtent();

  const kommuneList = useMemo(() => {
    return features.filter(
      (f) => f.getGeometry()?.intersectsExtent(viewExtent),
    );
  }, [features, viewExtent]);

  return (
    <aside className={layer ? "visible" : ""}>
      <div>
        <h2>Kommuner</h2>
        {kommuneList.map((k) => (
          <div key={k.getProperties().kommunenummer}>
            {getKommuneName(k.getProperties() as KommuneProperties)}
          </div>
        ))}
      </div>
    </aside>
  );
}
