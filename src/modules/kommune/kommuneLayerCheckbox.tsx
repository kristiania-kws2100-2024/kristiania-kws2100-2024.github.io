import React, { useContext, useEffect, useMemo, useState } from "react";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { GeoJSON } from "ol/format";
import { MapContext } from "../map/mapContextProvider";

export function KommuneLayerCheckbox() {
  const [show, setShow] = useState(false);
  const { setLayers } = useContext(MapContext);

  const kommuneLayer = useMemo(() => {
    return new VectorLayer({
      source: new VectorSource({
        url: "/kommuner.json",
        format: new GeoJSON(),
      }),
    });
  }, []);

  useEffect(() => {
    if (show) {
      setLayers((old) => [...old, kommuneLayer]);
    }
    return () => setLayers((old) => old.filter((l) => l !== kommuneLayer));
  }, [show]);

  return (
    <div>
      <label>
        <input
          type="checkbox"
          checked={show}
          onChange={(e) => setShow(e.target.checked)}
        />
        {show ? "Hide" : "Show"} kommuner
      </label>
    </div>
  );
}
