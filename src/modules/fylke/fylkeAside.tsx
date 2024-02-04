import React from "react";
import { Feature } from "ol";
import { useVectorFeatures } from "../map/useVectorFeatures";

export type FylkeFeature = {
  getProperties(): FylkeProperties;
} & Feature;

interface FylkeProperties {
  fylkesnummer: string;
  navn: Stedsnavn[];
}

// "navn": [{ "rekkefolge": "", "sprak": "nor", "navn": "Værøy" }]
interface Stedsnavn {
  sprak: "nor" | "sme" | "sma" | "smj" | "fkv";
  navn: string;
}

function getStedsnavn(navn: Stedsnavn[]) {
  return navn.find((n) => n.sprak === "nor")?.navn;
}

export function FylkeAside() {
  const { visibleFeatures } = useVectorFeatures<FylkeFeature>(
    (l) => l.getClassName() === "fylker",
  );

  return (
    <aside className={visibleFeatures?.length ? "visible" : "hidden"}>
      <div>
        <h2>Fylker</h2>
        <ul>
          {visibleFeatures?.map((k) => (
            <li>{getStedsnavn(k.getProperties().navn)}</li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
