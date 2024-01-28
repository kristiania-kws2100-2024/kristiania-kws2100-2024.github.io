import React, { useState } from "react";

export function KommuneLayerCheckbox() {
  const [checked, setChecked] = useState(true);
  return (
    <div>
      <label>
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => setChecked(e.target.checked)}
        />
        Show kommuner
      </label>
    </div>
  );
}
