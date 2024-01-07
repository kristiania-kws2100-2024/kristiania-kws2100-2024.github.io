import React, { useContext, useEffect, useMemo } from "react";
import { MapContext } from "../map/mapContextProvider";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { KommuneProperties } from "./kommuneProperties";

export function KommuneAside() {
  const { layers } = useContext(MapContext);
  const kommuneLayer = useMemo(
    () =>
      layers.find(
        (l) => l.getClassName() === "kommuner",
      ) as VectorLayer<VectorSource>,
    [layers],
  );
  const kommuner = useMemo(
    () =>
      kommuneLayer
        ?.getSource()
        ?.getFeatures()
        ?.map((f) => f.getProperties() as KommuneProperties) || [],
    [kommuneLayer],
  );
  return (
    <aside className={kommuneLayer ? "visible" : ""}>
      <div>
        <h2>Kommuner</h2>
        {kommuner.map((k) => (
          <div key={k.kommunenummer}>
            {k.navn.find((n) => n.sprak === "nor")?.navn}
          </div>
        ))}
      </div>
    </aside>
  );
}
