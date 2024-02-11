import React, { useContext, useEffect, useState } from "react";
import TileLayer from "ol/layer/Tile";
import { OSM, StadiaMaps } from "ol/source";
import { MapContext } from "../map/mapContext";

export function BaselayerSelector() {
  const { setBaseLayer } = useContext(MapContext);
  const options = {
    osm: {
      name: "Open Street Map",
      layer: new TileLayer({ source: new OSM() }),
    },
    stadia: {
      name: "Stadia",
      layer: new TileLayer({ source: new StadiaMaps({ layer: "outdoors" }) }),
    },
    dark: {
      name: "Stadia (dark)",
      layer: new TileLayer({
        source: new StadiaMaps({ layer: "alidade_smooth_dark" }),
      }),
    },
  };
  const [selected, setSelected] = useState<keyof typeof options>("osm");

  useEffect(() => {
    if (options[selected]) setBaseLayer(options[selected].layer);
  }, [selected]);

  return (
    <div>
      <label>
        Basiskart ({selected}):
        <select
          onChange={(e) => setSelected(e.target.value as any)}
          value={selected}
        >
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
