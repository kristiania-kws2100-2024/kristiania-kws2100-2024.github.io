import React, { useContext, useEffect, useMemo, useState } from "react";
import { MapContext } from "../map/mapContext";
import VectorSource from "ol/source/Vector";
import { getKommuneNavn, KommuneProperties } from "./kommune";
import VectorLayer from "ol/layer/Vector";
import { Feature } from "ol";

export function KommuneAside() {
  const { layers, view } = useContext(MapContext);

  const kommuneLayer = useMemo(() => {
    return layers.find(
      (l) => l.getClassName() === "kommuner",
    ) as VectorLayer<VectorSource>;
  }, [layers]);
  const [features, setFeatures] = useState<Feature[]>([]);
  function handleVectorSourceChange() {
    setFeatures(kommuneLayer?.getSource()?.getFeatures() || []);
  }
  useEffect(() => {
    kommuneLayer?.getSource()?.on("change", handleVectorSourceChange);
    return () =>
      kommuneLayer?.getSource()?.un("change", handleVectorSourceChange);
  }, [kommuneLayer]);

  const [viewExtent, setViewExtent] = useState(
    () => view.getViewStateAndExtent().extent,
  );
  function handleViewChange() {
    setViewExtent(view.getViewStateAndExtent().extent);
  }
  useEffect(() => {
    handleViewChange();
    view.on("change", handleViewChange);
    return () => view.un("change", handleViewChange);
  }, [view]);

  const kommuneList = useMemo(() => {
    return features
      .filter((f) => f.getGeometry()?.intersectsExtent(viewExtent))
      .map((f) => f.getProperties() as KommuneProperties)
      .sort((a, b) => getKommuneNavn(a).localeCompare(getKommuneNavn(b)));
  }, [features, viewExtent]);

  return (
    <aside className={kommuneLayer ? "is-open" : ""}>
      <div>
        <h2>Kommuner</h2>
        {kommuneList.map((k) => (
          <div key={k.kommunenummer}>{getKommuneNavn(k)}</div>
        ))}
      </div>
    </aside>
  );
}
