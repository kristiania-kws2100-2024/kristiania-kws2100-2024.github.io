import React, { useState } from "react";
import { useKommuneLayer } from "./useKommuneLayer";

export function KommuneLayerCheckbox() {
  const [show, setShow] = useState(false);
  useKommuneLayer(show);

  return (
    <div>
      <label>
        <input
          type="checkbox"
          checked={show}
          onChange={(e) => setShow(e.target.checked)}
        />
        {show ? "Hide" : "Show"} kommuner
      </label>
    </div>
  );
}
