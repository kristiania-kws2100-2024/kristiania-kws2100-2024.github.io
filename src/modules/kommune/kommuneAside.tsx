import React, { useContext, useEffect, useMemo, useState } from "react";
import { MapContext } from "../map/mapContext";
import VectorSource from "ol/source/Vector";
import { getKommuneNavn, KommuneProperties } from "./kommune";
import VectorLayer from "ol/layer/Vector";
import { Feature } from "ol";
import { Stroke, Style, Text } from "ol/style";
import { FeatureLike } from "ol/Feature";

function useKommuneFeatures() {
  const { layers } = useContext(MapContext);

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
  return { kommuneLayer, features };
}

function useViewExtent() {
  const { view } = useContext(MapContext);
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
  return viewExtent;
}

const selectedKommuneStyle = (f: FeatureLike) =>
  new Style({
    stroke: new Stroke({
      color: "red",
    }),
    text: new Text({
      text: getKommuneNavn(f.getProperties() as KommuneProperties),
    }),
  });

export function KommuneAside() {
  const { kommuneLayer, features } = useKommuneFeatures();
  const viewExtent = useViewExtent();

  const kommuneList = useMemo(() => {
    return features
      .filter((f) => f.getGeometry()?.intersectsExtent(viewExtent))
      .map((f) => f.getProperties() as KommuneProperties)
      .sort((a, b) => getKommuneNavn(a).localeCompare(getKommuneNavn(b)));
  }, [features, viewExtent]);

  function handleKommuneFocus(k?: KommuneProperties) {
    for (const feature of features) {
      const selected =
        feature.getProperties().kommunenummer === k?.kommunenummer;
      feature.setStyle(selected ? selectedKommuneStyle : undefined);
    }
  }

  return (
    <aside className={kommuneLayer ? "is-open" : ""}>
      <div onMouseLeave={() => handleKommuneFocus(undefined)}>
        <h2>Kommuner</h2>
        {kommuneList.map((k) => (
          <div onMouseEnter={() => handleKommuneFocus(k)} key={k.kommunenummer}>
            {getKommuneNavn(k)}
          </div>
        ))}
      </div>
    </aside>
  );
}
