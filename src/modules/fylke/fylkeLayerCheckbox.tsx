import React, { useContext, useEffect, useState } from "react";
import { MapContext } from "../map/mapContext";
import { fylkeLayer } from "./fylkeLayer";

export function FylkeLayerCheckbox() {
  const { setLayers } = useContext(MapContext);
  const [checked, setChecked] = useState(true);

  useEffect(() => {
    if (checked) {
      setLayers((old) => [...old, fylkeLayer]);
    }
    return () => {
      setLayers((old) => old.filter((l) => l !== fylkeLayer));
    };
  }, [checked]);

  return (
    <div>
      <label>
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => setChecked(e.target.checked)}
        />
        Show fylker
      </label>
    </div>
  );
}
