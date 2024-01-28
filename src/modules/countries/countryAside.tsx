import React, { useContext, useEffect, useMemo, useState } from "react";
import { MapContext } from "../map/mapContext";

import { CountryFeature, CountryLayer } from "./countryLayer";
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

export function CountryAside() {
  const { layers } = useContext(MapContext);
  const viewExtent = useViewExtent();
  const layer = useMemo(
    () => layers.find((l) => l.getClassName() === "country") as CountryLayer,
    [layers],
  );
  const [features, setFeatures] = useState<CountryFeature[]>([]);
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
  const [currentFeature, setCurrentFeature] = useState<
    CountryFeature | undefined
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
        <h2>Countries</h2>
        <div onMouseLeave={() => setCurrentFeature(undefined)}>
          {visibleFeatures.map((c) => (
            <div
              onMouseEnter={() => setCurrentFeature(c)}
              className={c === currentFeature ? "active" : ""}
            >
              {JSON.stringify(c.getProperties())}
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}
