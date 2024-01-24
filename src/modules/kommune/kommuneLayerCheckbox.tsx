import React, { useState } from "react";

export function KommuneLayerCheckbox() {
  const [checked, setChecked] = useState(false);
  return (
    <div>
      <label>
        <input
          type={"checkbox"}
          checked={checked}
          onChange={(e) => setChecked(e.target.checked)}
        />
        {checked ? "Hide" : "Show"} kommune layer
      </label>
    </div>
  );
}
