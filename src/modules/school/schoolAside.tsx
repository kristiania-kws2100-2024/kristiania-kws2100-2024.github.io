import { useVectorFeatures } from "../map/useVectorFeatures";
import React, { useContext, useEffect, useMemo, useState } from "react";
import { activeSchoolStyle, SchoolFeature } from "./schoolFeature";
import { MapContext } from "../map/mapContext";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { Layer } from "ol/layer";
import { MapBrowserEvent } from "ol";
import { FeatureLike } from "ol/Feature";

function useClosestFeature(layerSelector: (l: Layer) => boolean) {
  const { map, layers } = useContext(MapContext);
  const layer = useMemo(
    () => layers.find(layerSelector),
    [layers],
  ) as VectorLayer<VectorSource>;
  const [activeFeature, setActiveFeature] = useState<
    SchoolFeature | undefined
  >();

  function handlePointerMove(e: MapBrowserEvent<MouseEvent>) {
    const features: FeatureLike[] = [];
    map.forEachFeatureAtPixel(e.pixel, (f) => features.push(f), {
      hitTolerance: 4,
      layerFilter: (l) => l === layer,
    });
    if (features.length === 1) {
      setActiveFeature(features[0] as SchoolFeature);
    } else {
      setActiveFeature(undefined);
    }
  }

  useEffect(() => {
    if (layer) {
      map.on("pointermove", handlePointerMove);
    }
    return () => map.un("pointermove", handlePointerMove);
  }, [layer]);

  return { activeFeature, setActiveFeature };
}

export function SchoolAside() {
  const { visibleFeatures } = useVectorFeatures<SchoolFeature>(
    (l) => l.getClassName() === "schools",
  );
  const { activeFeature, setActiveFeature } = useClosestFeature(
    (l) => l.getClassName() === "schools",
  );
  useEffect(() => {
    activeFeature?.setStyle(activeSchoolStyle);
    return () => activeFeature?.setStyle(undefined);
  }, [activeFeature]);

  return (
    <aside
      className={
        visibleFeatures.length && visibleFeatures.length < 100
          ? "visible"
          : "hidden"
      }
    >
      <div>
        <h2>Skoler</h2>
        <ul onMouseLeave={() => setActiveFeature(undefined)}>
          {[...visibleFeatures]
            .sort((a, b) =>
              a.getProperties().navn.localeCompare(b.getProperties().navn),
            )
            .map((s) => (
              <li
                onMouseEnter={() => setActiveFeature(s)}
                className={activeFeature === s ? "active" : ""}
              >
                {s.getProperties().navn} ({s.getProperties().antall_elever}{" "}
                elever)
              </li>
            ))}
        </ul>
      </div>
    </aside>
  );
}
