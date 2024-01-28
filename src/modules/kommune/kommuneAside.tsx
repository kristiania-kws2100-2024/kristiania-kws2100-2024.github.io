import React from "react";

import { KommuneFeature } from "./kommuneLayer";
import { getStedsnavn } from "../sted/stedsNavn";
import { useFeatures } from "../map/useFeatures";

export function KommuneAside() {
  const { features, visibleFeatures } = useFeatures<KommuneFeature>(
    (l) => l.getClassName() === "kommuner",
  );

  return (
    <aside className={features.length ? "show" : "hide"}>
      <div>
        <h2>{visibleFeatures.length} Kommuner</h2>
        {visibleFeatures
          .sort((a, b) =>
            getStedsnavn(a.getProperties()).localeCompare(
              getStedsnavn(b.getProperties()),
            ),
          )
          .map((k) => (
            <div key={k.getProperties().kommunenummer}>
              {getStedsnavn(k.getProperties())}
            </div>
          ))}
      </div>
    </aside>
  );
}
