import React, { useState } from "react";

export function BaseLayerDropdown() {
  const baseLayerOptions = [
    {
      id: "osm",
      name: "Open Street Map",
    },
    {
      id: "stadia",
      name: "Stadia",
    },
  ];
  const [selectedLayer, setSelectedLayer] = useState(baseLayerOptions[0]);

  return (
    <div>
      <select
        onChange={(e) =>
          setSelectedLayer(
            baseLayerOptions.find((l) => l.id === e.target.value)!,
          )
        }
        value={selectedLayer.id}
      >
        {baseLayerOptions.map(({ id, name }) => (
          <option value={id}>{name}</option>
        ))}
      </select>
      {selectedLayer.name}
    </div>
  );
}
