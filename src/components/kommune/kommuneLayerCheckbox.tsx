import React, {Dispatch, SetStateAction, useState} from "react";
import {Layer} from "ol/layer";

export function KommuneLayerCheckbox({setLayers}: {
    setLayers: Dispatch<SetStateAction<Layer[]>>
}) {
  const [checked, setChecked] = useState(false);
  return (
    <div>
      <label>
        <input
          type={"checkbox"}
          checked={checked}
          onChange={(e) => setChecked(e.target.checked)}
        />
        {checked ? "Hide" : "Show"} kommuner
      </label>
    </div>
  );
}
