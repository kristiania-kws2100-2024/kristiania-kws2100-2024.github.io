import { useVectorFeatures } from "../map/useVectorFeatures";
import React from "react";
import { Feature } from "ol";
import { Point } from "ol/geom";

type SchoolFeature = { getProperties(): SchoolProperties } & Feature<Point>;

interface SchoolProperties {
  navn: string;
  antall_elever: number;
  antall_ansatte: number;
  laveste_trinn: number;
  hoyeste_trinn: number;
  eierforhold: "Offentlig" | "Privat";
  kommunenummer: string;
}

export function SchoolAside() {
  const { visibleFeatures } = useVectorFeatures<SchoolFeature>(
    (l) => l.getClassName() === "schools",
  );

  return (
    <aside className={visibleFeatures?.length ? "visible" : "hidden"}>
      <div>
        <h2>Skoler</h2>
        <ul>
          {visibleFeatures?.map((s) => <li>{s.getProperties().navn}</li>)}
        </ul>
      </div>
    </aside>
  );
}
