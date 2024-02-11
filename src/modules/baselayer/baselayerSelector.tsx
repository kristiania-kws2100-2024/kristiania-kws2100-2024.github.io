import React, { useContext, useEffect, useState } from "react";
import TileLayer from "ol/layer/Tile";
import { OSM, StadiaMaps, WMTS } from "ol/source";
import { MapContext } from "../map/mapContext";
import { Layer } from "ol/layer";
import { optionsFromCapabilities } from "ol/source/WMTS";
import { WMTSCapabilities } from "ol/format";
import { useLayer } from "../map/useLayer";

const parser = new WMTSCapabilities();

async function loadWmtsLayer(url: string, layer: string, matrixSet: string) {
  const response = await fetch(url);
  const text = await response.text();
  const options = optionsFromCapabilities(parser.read(text), {
    layer,
    matrixSet,
  })!;
  return new TileLayer({ source: new WMTS(options) });
}

function useAsyncLayer(fn: () => Promise<Layer>) {
  const [layer, setLayer] = useState<Layer>();
  useEffect(() => {
    fn().then(setLayer);
  }, []);
  return layer;
}

function loadKartverketLayer() {
  return loadWmtsLayer(
    "https://opencache.statkart.no/gatekeeper/gk/gk.open_wmts?request=GetCapabilities&service=WMS",
    "norgeskart_bakgrunn",
    "EPSG:4326",
  );
}

function loadPictureLayer() {
  return loadWmtsLayer(
    "https://opencache.statkart.no/gatekeeper/gk/gk.open_nib_web_mercator_wmts_v2?SERVICE=WMTS&REQUEST=GetCapabilities",
    "Nibcache_web_mercator_v2",
    "default028mm",
  );
}

export function BaselayerSelector() {
  const { setBaseLayer } = useContext(MapContext);
  const kartverketLayer = useAsyncLayer(loadKartverketLayer);
  const pictureLayer = useAsyncLayer(loadPictureLayer);
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
    kartverket: {
      name: "Kartverket",
      layer: kartverketLayer,
    },
    bilder: {
      name: "Norge i bilder",
      layer: pictureLayer,
    },
  };
  const [selected, setSelected] = useState<keyof typeof options>("osm");

  useEffect(() => {
    if (options[selected]?.layer) {
      console.log(options[selected].layer!.getSource()?.getProjection());
      setBaseLayer(options[selected].layer!);
    }
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
          <option value={"kartverket"}>Kartverket (WMTS)</option>
          <option value={"bilder"}>Norge i bilder (WMTS)</option>
          <option value={"polar"}>Polar</option>
        </select>
      </label>
    </div>
  );
}