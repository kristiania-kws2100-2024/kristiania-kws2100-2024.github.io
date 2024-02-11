import React, { useContext, useEffect, useState } from "react";
import TileLayer from "ol/layer/Tile";
import { OSM, StadiaMaps, WMTS } from "ol/source";
import { MapContext } from "../map/mapContext";
import { Layer } from "ol/layer";
import { optionsFromCapabilities } from "ol/source/WMTS";
import { WMTSCapabilities } from "ol/format";
import proj4 from "proj4";

import { register } from "ol/proj/proj4";

proj4.defs([
  [
    "EPSG:3571",
    "+proj=laea +lat_0=90 +lon_0=180 +x_0=0 +y_0=0 +datum=WGS84 +units=m +no_defs +type=crs",
  ],
  [
    "EPSG:3575",
    "+proj=laea +lat_0=90 +lon_0=10 +x_0=0 +y_0=0 +datum=WGS84 +units=m +no_defs +type=crs",
  ],
  [
    "EPSG:32632",
    "+proj=utm +zone=32 +datum=WGS84 +units=m +no_defs +type=crs\n",
  ],
]);
register(proj4);

const parser = new WMTSCapabilities();

async function loadWmtsLayer(url: string, config: any) {
  const response = await fetch(url);
  const text = await response.text();
  const options = optionsFromCapabilities(parser.read(text), config)!;
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
    {
      layer: "norgeskart_bakgrunn",
      matrixSet: "EPSG:32632",
    },
  );
}

function loadPictureLayer() {
  return loadWmtsLayer(
    "https://opencache.statkart.no/gatekeeper/gk/gk.open_nib_web_mercator_wmts_v2?SERVICE=WMTS&REQUEST=GetCapabilities",
    {
      layer: "Nibcache_web_mercator_v2",
      matrixSet: "default028mm",
    },
  );
}

function loadPolarLayer() {
  return loadWmtsLayer("/arctic-sdi-capabilities.xml", {
    layer: "arctic_cascading",
    matrixSet: "3575",
  });
}

export function BaselayerSelector() {
  const { setBaseLayer } = useContext(MapContext);
  const kartverketLayer = useAsyncLayer(loadKartverketLayer);
  const pictureLayer = useAsyncLayer(loadPictureLayer);
  const polarLayer = useAsyncLayer(loadPolarLayer);
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
    polar: {
      name: "Polar",
      layer: polarLayer,
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
