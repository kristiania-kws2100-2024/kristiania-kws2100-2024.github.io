import React, { useMemo } from "react";
import { getKommuneName, KommuneProperties } from "./kommuneProperties";
import { useViewExtent } from "../map/useViewExtent";
import { useFeatureLayer } from "../map/useFeatureLayer";
import { Feature } from "ol";
import { Stroke, Style, Text } from "ol/style";

export function KommuneAside() {
  const { features, layer } = useFeatureLayer(
    (l) => l.getClassName() === "kommuner",
  );
  const viewExtent = useViewExtent();

  const kommuneList = useMemo(() => {
    return features
      .filter((f) => f.getGeometry()?.intersectsExtent(viewExtent))
      .sort((a, b) =>
        getKommuneName(a.getProperties() as KommuneProperties).localeCompare(
          getKommuneName(b.getProperties() as KommuneProperties),
        ),
      );
  }, [features, viewExtent]);

  function handleMouseEnter(feature?: Feature) {
    for (const f of features) {
      f.setStyle(
        f === feature
          ? new Style({
              stroke: new Stroke({ color: "red" }),
              text: new Text({
                text: getKommuneName(f.getProperties() as KommuneProperties),
              }),
            })
          : undefined,
      );
    }
  }

  return (
    <aside className={layer ? "visible" : ""}>
      <div onMouseLeave={() => handleMouseEnter(undefined)}>
        <h2>Kommuner</h2>
        {kommuneList.map((k) => (
          <div
            key={k.getProperties().kommunenummer}
            onMouseEnter={() => handleMouseEnter(k)}
          >
            {getKommuneName(k.getProperties() as KommuneProperties)}
          </div>
        ))}
      </div>
    </aside>
  );
}
