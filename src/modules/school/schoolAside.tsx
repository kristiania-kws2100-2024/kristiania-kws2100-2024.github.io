import { useVectorFeatures } from "../map/useVectorFeatures";
import React, { useEffect, useState } from "react";
import { activeSchoolStyle, SchoolFeature } from "./schoolFeature";

export function SchoolAside() {
  const { visibleFeatures } = useVectorFeatures<SchoolFeature>(
    (l) => l.getClassName() === "schools",
  );
  const [activeFeature, setActiveFeature] = useState<
    SchoolFeature | undefined
  >();
  useEffect(() => {
    activeFeature?.setStyle(activeSchoolStyle);
    return () => activeFeature?.setStyle(undefined);
  }, [activeFeature]);

  return (
    <aside className={visibleFeatures.length ? "visible" : "hidden"}>
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
