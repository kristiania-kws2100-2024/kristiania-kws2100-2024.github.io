import { Layer } from "ol/layer";
import React, { useMemo } from "react";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { KommuneFeature } from "./kommuneFeature";

export function KommuneAside({ layers }: { layers: Layer[] }) {
  const kommuneLayer = useMemo(
    () =>
      layers.find((l) => l.getClassName() === "kommuner") as VectorLayer<
        VectorSource<KommuneFeature>
      >,
    [layers],
  );
  const kommuneFeatures = useMemo(() => {
    return kommuneLayer?.getSource()?.getFeatures() || [];
  }, [kommuneLayer]);

  return (
    <aside className={kommuneLayer ? "show" : ""}>
      <div>
        <h2>Kommuner</h2>
        {kommuneFeatures.map((k) => (
          <div key={k.getProperties().kommunenummer}>
            {k.getProperties().navn.find((n) => n.sprak === "nor")!.navn}
          </div>
        ))}
      </div>
    </aside>
  );
}
