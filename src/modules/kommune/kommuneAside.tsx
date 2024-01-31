import React, { useContext } from "react";
import { MapContext } from "../map/mapContext";
import VectorSource from "ol/source/Vector";

export function KommuneAside() {
  const { layers } = useContext(MapContext);

  const kommuneLayer = layers.find((l) => l.getClassName() === "kommuner");
  const features = (kommuneLayer?.getSource() as VectorSource)?.getFeatures();

  return (
    <aside className={kommuneLayer ? "visible" : "hidden"}>
      <div>
        <h2>Kommuner</h2>

        <ul>
          {features?.map((k) => <li>{k.getProperties().kommunenummer}</li>)}
        </ul>
      </div>
    </aside>
  );
}
