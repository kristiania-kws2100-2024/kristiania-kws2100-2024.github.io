import React, { useContext, useEffect, useMemo, useState } from "react";
import VectorSource from "ol/source/Vector";
import VectorLayer from "ol/layer/Vector";
import { Feature } from "ol";
import { useVectorFeatures } from "../map/useVectorFeatures";
import { Layer } from "ol/layer";
import { MapContext } from "../map/mapContext";

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

function useActiveFeatures<FEATURE extends Feature>(
  predicate: (l: Layer) => boolean,
) {
  const [activeFeatures, setActiveFeatures] = useState<FEATURE[]>([]);

  return { activeFeatures, setActiveFeatures };
}

export function KommuneAside() {
  const { visibleFeatures } = useVectorFeatures<KommuneFeature>(
    (l) => l.getClassName() === "kommuner",
  );
  const { activeFeatures, setActiveFeatures } =
    useActiveFeatures<KommuneFeature>((l) => l.getClassName() === "kommuner");

  return (
    <aside className={visibleFeatures?.length ? "visible" : "hidden"}>
      <div>
        <h2>Kommuner</h2>
        <ul onMouseLeave={() => setActiveFeatures([])}>
          {visibleFeatures?.map((k) => (
            <li
              onMouseEnter={() => setActiveFeatures([k])}
              className={activeFeatures.includes(k) ? "active" : ""}
            >
              {getStedsnavn(k.getProperties().navn)}
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
