import React, { useContext, useEffect, useMemo, useState } from "react";
import { MapContext } from "../map/mapContext";

import { FylkeFeature, FylkeLayer } from "./fylkeLayer";
import { useViewExtent } from "../map/useViewExtent";
import { Fill, Stroke, Style } from "ol/style";
import { getStedsnavn } from "../sted/stedsNavn";
import { useFeatures } from "../map/useFeatures";
import { CountryFeature } from "../countries/countryLayer";

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
  const { features, visibleFeatures } = useFeatures<FylkeFeature>(
    (l) => l.getClassName() === "fylke",
  );
  const [currentFeature, setCurrentFeature] = useState<
    FylkeFeature | undefined
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
        <h2>Fylker</h2>
        <div onMouseLeave={() => setCurrentFeature(undefined)}>
          {visibleFeatures
            .sort((a, b) =>
              getStedsnavn(a.getProperties()).localeCompare(
                getStedsnavn(b.getProperties()),
              ),
            )
            .map((f) => (
              <div
                key={f.getProperties().fylkenummer}
                onMouseEnter={() => setCurrentFeature(f)}
                className={f === currentFeature ? "active" : ""}
              >
                {getStedsnavn(f.getProperties())}
              </div>
            ))}
        </div>
      </div>
    </aside>
  );
}
