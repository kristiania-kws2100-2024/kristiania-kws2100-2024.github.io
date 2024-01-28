import React, { useContext, useEffect, useMemo, useState } from "react";
import { MapContext } from "../map/mapContext";

import { FylkeFeature, FylkeLayer } from "./fylkeLayer";
import { useViewExtent } from "../map/useViewExtent";
import { Fill, Stroke, Style } from "ol/style";
import { getStedsnavn } from "../sted/stedsNavn";

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
  const { layers } = useContext(MapContext);
  const viewExtent = useViewExtent();
  const layer = useMemo(
    () => layers.find((l) => l.getClassName() === "fylke") as FylkeLayer,
    [layers],
  );
  const [features, setFeatures] = useState<FylkeFeature[]>([]);
  const visibleFeatures = useMemo(() => {
    return features
      .filter((f) => f.getGeometry()?.intersectsExtent(viewExtent))
      .sort((a, b) =>
        getStedsnavn(a.getProperties()).localeCompare(
          getStedsnavn(b.getProperties()),
        ),
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
    <aside className={layer ? "show" : "hide"}>
      <div>
        <h2>Fylker</h2>
        <div onMouseLeave={() => setCurrentFeature(undefined)}>
          {visibleFeatures.map((k) => (
            <div
              key={k.getProperties().fylkenummer}
              onMouseEnter={() => setCurrentFeature(k)}
              className={k === currentFeature ? "active" : ""}
            >
              {getStedsnavn(k.getProperties())}
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}
