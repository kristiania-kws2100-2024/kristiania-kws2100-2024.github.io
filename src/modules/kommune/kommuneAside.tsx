import React from "react";
import VectorSource from "ol/source/Vector";
import VectorLayer from "ol/layer/Vector";
import { Feature } from "ol";
import { useVectorFeatures } from "../map/useVectorFeatures";

type KommuneVectorLayer = VectorLayer<VectorSource<KommuneFeature>>;

interface KommuneProperties {
  kommunenummer: string;
  navn: Stedsnavn[];
}

// "navn": [{ "rekkefolge": "", "sprak": "nor", "navn": "Værøy" }]
interface Stedsnavn {
  sprak: "nor" | "sme" | "sma" | "smj" | "fkv";
  navn: string;
}

type KommuneFeature = {
  getProperties(): KommuneProperties;
} & Feature;

function getStedsnavn(navn: Stedsnavn[]) {
  return navn.find((n) => n.sprak === "nor")?.navn;
}

export function KommuneAside() {
  const { visibleFeatures } = useVectorFeatures<KommuneFeature>(
    (l) => l.getClassName() === "kommune",
  );

  return (
    <aside className={visibleFeatures?.length ? "visible" : "hidden"}>
      <div>
        <h2>Kommuner</h2>
        <ul>
          {visibleFeatures?.map((k) => (
            <li>{getStedsnavn(k.getProperties().navn)}</li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
