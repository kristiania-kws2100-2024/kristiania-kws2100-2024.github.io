import React, { useEffect, useState } from "react";

import { KommuneFeature } from "./kommuneLayer";
import { getStedsnavn } from "../sted/stedsNavn";
import { useFeatures } from "../map/useFeatures";
import { Fill, Stroke, Style } from "ol/style";

const selectedStyle = new Style({
  stroke: new Stroke({
    color: "black",
    width: 3,
  }),
  fill: new Fill({
    color: [0, 0, 0, 0.2],
  }),
});

export function KommuneAside() {
  const { features, visibleFeatures, activeFeature, setActiveFeature } =
    useFeatures<KommuneFeature>((l) => l.getClassName() === "kommuner");
  useEffect(() => {
    activeFeature?.setStyle(selectedStyle);
    return () => activeFeature?.setStyle(undefined);
  }, [activeFeature]);

  return (
    <aside className={features.length ? "show" : "hide"}>
      <div>
        <h2>{visibleFeatures.length} Kommuner</h2>
        <div onMouseLeave={() => setActiveFeature(undefined)}>
          {visibleFeatures
            .sort((a, b) =>
              getStedsnavn(a.getProperties()).localeCompare(
                getStedsnavn(b.getProperties()),
              ),
            )
            .map((k) => (
              <div
                onMouseEnter={() => setActiveFeature(k)}
                key={k.getProperties().kommunenummer}
                className={k === activeFeature ? "active" : ""}
              >
                {getStedsnavn(k.getProperties())}
              </div>
            ))}
        </div>
      </div>
    </aside>
  );
}
