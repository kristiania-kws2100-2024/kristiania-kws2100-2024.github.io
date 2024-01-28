import React, { useEffect, useState } from "react";

import { StationFeature } from "./stationLayer";
import { Fill, Stroke, Style } from "ol/style";
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

export function StationAside() {
  const { features, visibleFeatures } = useFeatures<StationFeature>(
    (l) => l.getClassName() === "station",
  );
  const [currentFeature, setCurrentFeature] = useState<
    StationFeature | undefined
  >();
  useEffect(() => {
    currentFeature?.setStyle(selectedStyle);
    return () => {
      currentFeature?.setStyle(undefined);
    };
  }, [currentFeature]);

  return (
    <aside className={features.length ? "show" : "hide"}>
      <div>
        <h2>Stations</h2>
        <div onMouseLeave={() => setCurrentFeature(undefined)}>
          {visibleFeatures
            .sort((a, b) =>
              a.getProperties().navn.localeCompare(b.getProperties().navn),
            )
            .map((c) => (
              <div
                key={c.getProperties().navn}
                onMouseEnter={() => setCurrentFeature(c)}
                className={c === currentFeature ? "active" : ""}
              >
                {c.getProperties().navn}
              </div>
            ))}
        </div>
      </div>
    </aside>
  );
}
