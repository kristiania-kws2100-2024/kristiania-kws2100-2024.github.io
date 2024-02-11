import React, { useState } from "react";

export function BaselayerSelector() {
  const [selected, setSelected] = useState<string>("osm");
  return (
    <div>
      <label>
        Basiskart ({selected}):
        <select onChange={(e) => setSelected(e.target.value)} value={selected}>
          <option value={"osm"}>Open Street Map</option>
          <option value={"stadia"}>Stadia</option>
          <option value={"dark"}>Stadia (dark)</option>
          <option value={"kartverket"}>Kartverket (WFS)</option>
          <option value={"bilder"}>Norge i bilder (WFS)</option>
          <option value={"polar"}>Polar</option>
        </select>
      </label>
    </div>
  );
}
