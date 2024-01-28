import React, { useEffect, useState } from "react";

import { StationFeature } from "./stationLayer";
import { Circle, Fill, Stroke, Style } from "ol/style";
import { useFeatures } from "../map/useFeatures";

const selectedStyle = new Style({
  stroke: new Stroke({
    color: "black",
    width: 3,
  }),
  fill: new Fill({
    color: [0, 0, 0, 0.2],
  }),
  image: new Circle({
    stroke: new Stroke({ color: "red", width: 2 }),
    radius: 5,
  }),
});

export function StationAside() {
  const { features, visibleFeatures, activeFeature, setActiveFeature } =
    useFeatures<StationFeature>((l) => l.getClassName() === "station");
  useEffect(() => {
    activeFeature?.setStyle(selectedStyle);
    return () => activeFeature?.setStyle(undefined);
  }, [activeFeature]);

  return (
    <aside className={features.length ? "show" : "hide"}>
      <div>
        <h2>Stations</h2>
        <div onMouseLeave={() => setActiveFeature(undefined)}>
          {visibleFeatures
            .sort((a, b) =>
              a.getProperties().navn.localeCompare(b.getProperties().navn),
            )
            .map((c) => (
              <div
                key={c.getProperties().navn}
                onMouseEnter={() => setActiveFeature(c)}
                className={c === activeFeature ? "active" : ""}
              >
                {c.getProperties().navn}
              </div>
            ))}
        </div>
      </div>
    </aside>
  );
}
