import { useVectorFeatures } from "../map/useVectorFeatures";
import React from "react";
import { SchoolFeature } from "./schoolFeature";

export function SchoolAside() {
  const { visibleFeatures } = useVectorFeatures<SchoolFeature>(
    (l) => l.getClassName() === "schools",
  );

  return (
    <aside className={visibleFeatures.length ? "visible" : "hidden"}>
      <div>
        <h2>Skoler</h2>
        <ul>
          {[...visibleFeatures]
            .sort((a, b) =>
              a.getProperties().navn.localeCompare(b.getProperties().navn),
            )
            .map((s) => (
              <li>
                {s.getProperties().navn} ({s.getProperties().antall_elever}{" "}
                elever)
              </li>
            ))}
        </ul>
      </div>
    </aside>
  );
}
