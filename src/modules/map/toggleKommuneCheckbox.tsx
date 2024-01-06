import React, { useContext, useEffect, useMemo, useState } from "react";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { GeoJSON } from "ol/format";
import { MapContext } from "./mapContext";
import { MapBrowserEvent, MapEvent } from "ol";

interface KommuneProperties {
  kommunenummer: string;
  navn: { sprak: string; navn: string }[];
}

export function ToggleKommuneCheckbox() {
  const [showKommuner, setShowKommuner] = useState(false);
  const [kommuneAtMouse, setKommuneAtMouse] = useState<
    KommuneProperties | undefined
  >(undefined);
  const kommuneLayer = useMemo(() => {
    return new VectorLayer({
      source: new VectorSource({
        url: "/kommuner.json",
        format: new GeoJSON(),
      }),
    });
  }, []);
  function handlePointerMove(e: MapBrowserEvent<MouseEvent>) {
    const featuresAtCoordinate = kommuneLayer
      .getSource()
      ?.getFeaturesAtCoordinate(e.coordinate);
    const kommune = (
      featuresAtCoordinate
        ? featuresAtCoordinate[0]?.getProperties()
        : undefined
    ) as KommuneProperties | undefined;
    setKommuneAtMouse((old) =>
      old?.kommunenummer != kommune?.kommunenummer ? kommune : old,
    );
  }

  useEffect(() => {
    console.log(kommuneAtMouse?.navn.find((n) => n.sprak === "nor")?.navn);
  }, [kommuneAtMouse]);
  const { setLayers, map } = useContext(MapContext);
  useEffect(() => {
    if (showKommuner) {
      setLayers((old) => [...old, kommuneLayer]);
      map.on("pointermove", handlePointerMove);
    } else {
      setLayers((old) => old.filter((l) => l != kommuneLayer));
      map.un("pointermove", handlePointerMove);
    }
  }, [showKommuner]);

  return (
    <div>
      <label>
        <input
          type="checkbox"
          checked={showKommuner}
          onChange={(e) => setShowKommuner(e.target.checked)}
        />
        <span>{showKommuner ? "Hide" : "Show"} kommuner</span>
      </label>
    </div>
  );
}
