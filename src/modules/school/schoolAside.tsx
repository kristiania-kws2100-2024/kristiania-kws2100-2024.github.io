import { useVectorFeatures } from "../map/useVectorFeatures";
import React from "react";

export function SchoolAside() {
  const { visibleFeatures } = useVectorFeatures(
    (l) => l.getClassName() === "schools",
  );

  return (
    <aside className={visibleFeatures?.length ? "visible" : "hidden"}>
      <div>
        <h2>Skoler</h2>
        <ul>{visibleFeatures?.map((k) => <li>school</li>)}</ul>
      </div>
    </aside>
  );
}
