import React, { useContext, useEffect, useMemo, useState } from "react";
import { MapContext } from "../map/mapContext";

import { FylkeFeature, FylkeLayer } from "./fylkeLayer";
import { useViewExtent } from "../map/useViewExtent";

export function FylkeAside() {
  const { layers } = useContext(MapContext);
  const viewExtent = useViewExtent();
  const layer = useMemo(
    () => layers.find((l) => l.getClassName() === "fylke") as FylkeLayer,
    [layers],
  );
  const [features, setFeatures] = useState<FylkeFeature[]>([]);
  const visibleFeatures = useMemo(() => {
    return features.filter((f) =>
      f.getGeometry()?.intersectsExtent(viewExtent),
    );
  }, [features, viewExtent]);
  function loadFeatures() {
    setFeatures(layer?.getSource()?.getFeatures() || []);
  }
  useEffect(() => {
    layer?.on("change", loadFeatures);
    loadFeatures();
    return () => {
      layer?.un("change", loadFeatures);
      setFeatures([]);
    };
  }, [layer]);

  return (
    <aside className={layer ? "show" : "hide"}>
      <div>
        <h2>{visibleFeatures.length} fylke</h2>
        {visibleFeatures.map((k) => (
          <div key={k.getProperties().fylkenummer}>
            {k.getProperties().navn.find((n) => n.sprak === "nor")!.navn}
          </div>
        ))}
      </div>
    </aside>
  );
}
