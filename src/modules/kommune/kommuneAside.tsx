import { Layer } from "ol/layer";
import React, { useEffect, useMemo, useState } from "react";
import { KommuneFeature, KommuneLayer } from "./kommuneFeature";
import { Map } from "ol";

function getKommuneNavn(k: KommuneFeature) {
  return k.getProperties().navn.find((n) => n.sprak === "nor")!.navn;
}

export function KommuneAside({ layers, map }: { layers: Layer[]; map: Map }) {
  const kommuneLayer = useMemo(
    () => layers.find((l) => l.getClassName() === "kommuner") as KommuneLayer,
    [layers],
  );
  const [kommuneFeatures, setKommuneFeatures] = useState<KommuneFeature[]>([]);
  const [viewExtent, setViewExtent] = useState(
    map.getView().getViewStateAndExtent().extent,
  );
  const visibleFeatures = useMemo(() => {
    return kommuneFeatures.filter((f) =>
      f.getGeometry()?.intersectsExtent(viewExtent),
    );
  }, [viewExtent, kommuneFeatures]);
  function handleLayerChange() {
    const features = kommuneLayer?.getSource()?.getFeatures() || [];
    features.sort((a, b) => getKommuneNavn(a).localeCompare(getKommuneNavn(b)));
    setKommuneFeatures(features || []);
  }
  useEffect(() => {
    kommuneLayer?.on("change", handleLayerChange);
    return () => kommuneLayer?.un("change", handleLayerChange);
  }, [kommuneLayer]);
  useEffect(() => {
    function handleViewChange() {
      setViewExtent(map.getView().getViewStateAndExtent().extent);
    }
    map.getView().on("change", handleViewChange);
    return () => map.getView().un("change", handleViewChange);
  }, []);

  return (
    <aside className={kommuneLayer ? "show" : ""}>
      <div>
        <h2>Kommuner</h2>
        {visibleFeatures.map((k) => (
          <div key={k.getProperties().kommunenummer}>{getKommuneNavn(k)}</div>
        ))}
      </div>
    </aside>
  );
}
