import React, { useContext, useEffect, useState } from "react";
import TileLayer from "ol/layer/Tile";
import { OSM, StadiaMaps } from "ol/source";
import { MapContext } from "../map/mapContext";

export function BaseLayerDropdown() {
  const { setBaseLayer } = useContext(MapContext);
  const baseLayerOptions = [
    {
      id: "osm",
      name: "Open Street Map",
      layer: new TileLayer({ source: new OSM() }),
    },
    {
      id: "stadia",
      name: "Stadia",
      layer: new TileLayer({ source: new StadiaMaps({ layer: "outdoors" }) }),
    },
    {
      id: "stadia_dark",
      name: "Stadia (dark)",
      layer: new TileLayer({
        source: new StadiaMaps({ layer: "alidade_smooth_dark" }),
      }),
    },
  ];
  const [selectedLayer, setSelectedLayer] = useState(baseLayerOptions[0]);
  useEffect(() => setBaseLayer(selectedLayer.layer), [selectedLayer]);

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
          <option key={id} value={id}>
            {name}
          </option>
        ))}
      </select>
      {selectedLayer.name}
    </div>
  );
}
