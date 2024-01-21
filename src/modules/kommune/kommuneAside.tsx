import { Layer } from "ol/layer";
import React, { useEffect, useMemo, useState } from "react";
import { KommuneFeature, KommuneLayer } from "./kommuneFeature";
import { Map, MapBrowserEvent } from "ol";
import { Stroke, Style } from "ol/style";

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
  function changeFocusedFeature(feature?: KommuneFeature) {
    setFocusedFeature((old) => {
      if (old === feature) {
        return old;
      } else {
        old?.setStyle(undefined);
        feature?.setStyle(
          new Style({
            stroke: new Stroke({ color: "red" }),
          }),
        );
        return feature;
      }
    });
  }
  const visibleFeatures = useMemo(() => {
    return kommuneFeatures.filter((f) =>
      f.getGeometry()?.intersectsExtent(viewExtent),
    );
  }, [viewExtent, kommuneFeatures]);
  const [focusedFeature, setFocusedFeature] = useState<
    KommuneFeature | undefined
  >();
  function handleLayerChange() {
    const features = kommuneLayer?.getSource()?.getFeatures() || [];
    features.sort((a, b) => getKommuneNavn(a).localeCompare(getKommuneNavn(b)));
    setKommuneFeatures(features || []);
  }
  function handlePointerMove(e: MapBrowserEvent<MouseEvent>) {
    const hoverFeatures = kommuneLayer
      ?.getSource()
      ?.getFeaturesAtCoordinate(e.coordinate);
    if (hoverFeatures?.length === 1) {
      changeFocusedFeature(hoverFeatures[0] as KommuneFeature);
    }
  }
  useEffect(() => {
    kommuneLayer?.on("change", handleLayerChange);
    if (kommuneLayer) {
      map.on("pointermove", handlePointerMove);
    }
    return () => {
      map.on("pointermove", handlePointerMove);
      return kommuneLayer?.un("change", handleLayerChange);
    };
  }, [kommuneLayer]);
  useEffect(() => {
    function handleViewChange() {
      setViewExtent(map.getView().getViewStateAndExtent().extent);
    }
    map.getView().on("change", handleViewChange);
    return () => {
      map.getView().un("change", handleViewChange);
    };
  }, []);

  return (
    <aside className={kommuneLayer ? "show" : ""}>
      <div onMouseLeave={() => changeFocusedFeature(undefined)}>
        <h2>Kommuner</h2>
        {visibleFeatures.map((k) => (
          <div
            key={k.getProperties().kommunenummer}
            onMouseEnter={() => changeFocusedFeature(k)}
            className={"kommune" + (k === focusedFeature ? " active" : "")}
          >
            {getKommuneNavn(k)}
          </div>
        ))}
      </div>
    </aside>
  );
}
