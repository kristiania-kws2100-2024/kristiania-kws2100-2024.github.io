import React, { useContext, useEffect, useMemo, useState } from "react";
import { MapContext } from "../map/mapContext";
import VectorSource from "ol/source/Vector";
import { KommuneProperties } from "./kommune";

export function KommuneAside() {
  const { layers, view } = useContext(MapContext);
  const kommuneLayer = useMemo(() => {
    return layers.find((l) => l.getClassName() === "kommuner");
  }, [layers]);

  const [viewExtent, setViewExtent] = useState(
    () => view.getViewStateAndExtent().extent,
  );
  function handleViewChange() {
    setViewExtent(view.getViewStateAndExtent().extent);
  }
  useEffect(() => {
    view.on("change", handleViewChange);
    return () => view.un("change", handleViewChange);
  }, []);

  const kommuneList = useMemo(() => {
    return kommuneLayer
      ? (kommuneLayer.getSource() as VectorSource)
          .getFeatures()
          .filter((f) => f.getGeometry()?.intersectsExtent(viewExtent))
          .map((f) => f.getProperties() as KommuneProperties)
          .map((k) => k.navn.find((n) => n.sprak === "nor")!.navn)
          .sort()
      : [];
  }, [kommuneLayer, viewExtent]);

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
