import React, { useEffect, useState } from "react";

import { FylkeFeature } from "./fylkeLayer";
import { Fill, Stroke, Style } from "ol/style";
import { getStedsnavn } from "../sted/stedsNavn";
import { useFeatures } from "../map/useFeatures";

const selectedStyle = new Style({
  stroke: new Stroke({
    color: "black",
    width: 3,
  }),
  fill: new Fill({
    color: [0, 0, 0, 0.2],
  }),
});

export function FylkeAside() {
  const { features, visibleFeatures, activeFeature, setActiveFeature } =
    useFeatures<FylkeFeature>((l) => l.getClassName() === "fylke");
  useEffect(() => {
    activeFeature?.setStyle(selectedStyle);
    return () => activeFeature?.setStyle(undefined);
  }, [activeFeature]);

  return (
    <aside className={features.length ? "show" : "hide"}>
      <div>
        <h2>Fylker</h2>
        <div onMouseLeave={() => setActiveFeature(undefined)}>
          {visibleFeatures
            .sort((a, b) =>
              getStedsnavn(a.getProperties()).localeCompare(
                getStedsnavn(b.getProperties()),
              ),
            )
            .map((f) => (
              <div
                key={f.getProperties().fylkenummer}
                onMouseEnter={() => setActiveFeature(f)}
                className={f === activeFeature ? "active" : ""}
              >
                {getStedsnavn(f.getProperties())}
              </div>
            ))}
        </div>
      </div>
    </aside>
  );
}
