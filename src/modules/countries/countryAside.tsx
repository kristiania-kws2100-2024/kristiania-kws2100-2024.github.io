import React, { useEffect, useState } from "react";

import { CountryFeature } from "./countryLayer";
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

export function CountryAside() {
  const { features, visibleFeatures, activeFeature, setActiveFeature } =
    useFeatures<CountryFeature>((l) => l.getClassName() === "country");
  useEffect(() => {
    activeFeature?.setStyle(selectedStyle);
    return () => activeFeature?.setStyle(undefined);
  }, [activeFeature]);

  return (
    <aside className={features.length ? "show" : "hide"}>
      <div>
        <h2>Countries</h2>
        <div onMouseLeave={() => setActiveFeature(undefined)}>
          {visibleFeatures
            .sort((a, b) =>
              a.getProperties().ADMIN.localeCompare(b.getProperties().ADMIN),
            )
            .map((c) => (
              <div
                key={c.getProperties().ISO_A3}
                onMouseEnter={() => setActiveFeature(c)}
                className={c === activeFeature ? "active" : ""}
              >
                {c.getProperties().ADMIN}
              </div>
            ))}
        </div>
      </div>
    </aside>
  );
}
