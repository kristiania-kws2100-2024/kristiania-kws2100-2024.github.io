import React, { useContext, useMemo } from "react";
import { MapContext } from "../map/mapContext";
import VectorSource from "ol/source/Vector";
import { KommuneProperties } from "./kommune";

export function KommuneAside() {
  const { layers, view } = useContext(MapContext);
  const kommuneLayer = useMemo(() => {
    return layers.find((l) => l.getClassName() === "kommuner");
  }, [layers]);

  const kommuneList = useMemo(() => {
    return kommuneLayer
      ? (kommuneLayer.getSource() as VectorSource)
          .getFeatures()
          .filter(
            (f) =>
              f
                .getGeometry()
                ?.intersectsExtent(view.getViewStateAndExtent().extent),
          )
          .map((f) => f.getProperties() as KommuneProperties)
          .map((k) => k.navn.find((n) => n.sprak === "nor")!.navn)
          .sort()
      : [];
  }, [kommuneLayer]);

  return (
    <aside className={kommuneLayer ? "is-open" : ""}>
      <div>
        <h2>Kommuner</h2>
        {kommuneList.map((k) => (
          <div>{k}</div>
        ))}
      </div>
    </aside>
  );
}
