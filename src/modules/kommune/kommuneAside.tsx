import React, { useEffect } from "react";
import VectorSource from "ol/source/Vector";
import VectorLayer from "ol/layer/Vector";
import { Feature } from "ol";
import { useVectorFeatures } from "../map/useVectorFeatures";
import { Stroke, Style } from "ol/style";
import { useActiveFeatures } from "../map/useActiveFeatures";

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

const activeStyle = new Style({
  stroke: new Stroke({ color: "black", width: 3 }),
});

export function KommuneAside() {
  const { visibleFeatures } = useVectorFeatures<KommuneFeature>(
    (l) => l.getClassName() === "kommuner",
  );
  const { activeFeatures, setActiveFeatures } =
    useActiveFeatures<KommuneFeature>((l) => l.getClassName() === "kommuner");
  useEffect(() => {
    console.log("updateActiveFeatures");
    activeFeatures.forEach((f) => f.setStyle(activeStyle));
    return () => activeFeatures.forEach((f) => f.setStyle(undefined));
  }, [activeFeatures]);

  return (
    <aside className={visibleFeatures?.length ? "visible" : "hidden"}>
      <div>
        <h2>Kommuner</h2>
        <ul onMouseLeave={() => setActiveFeatures([])}>
          {visibleFeatures?.map((k) => (
            <li
              key={k.getProperties().kommunenummer}
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
