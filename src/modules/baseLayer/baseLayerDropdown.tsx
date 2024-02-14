import React, { useContext, useEffect, useState } from "react";
import TileLayer from "ol/layer/Tile";
import { OSM, StadiaMaps, WMTS } from "ol/source";
import { MapContext } from "../map/mapContext";
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
]);
register(proj4);

const parser = new WMTSCapabilities();

async function loadWtmsSource(
  url: string,
  config: { matrixSet: string; layer: string },
) {
  const res = await fetch(url);
  const text = await res.text();
  const result = parser.read(text);
  return new WMTS(optionsFromCapabilities(result, config)!);
}

async function loadFlyfotoLayer() {
  return await loadWtmsSource(
    "https://opencache.statkart.no/gatekeeper/gk/gk.open_nib_web_mercator_wmts_v2?SERVICE=WMTS&REQUEST=GetCapabilities",
    {
      layer: "Nibcache_web_mercator_v2",
      matrixSet: "default028mm",
    },
  );
}

async function loadKartverket() {
  return await loadWtmsSource(
    "https://opencache.statkart.no/gatekeeper/gk/gk.open_wmts?request=GetCapabilities&service=WMS",
    {
      layer: "norgeskart_bakgrunn",
      matrixSet: "EPSG:3857",
    },
  );
}

async function loadPolar() {
  return await loadWtmsSource("/arctic-sdi.xml", {
    layer: "arctic_cascading",
    matrixSet: "3575",
  });
}

const ortoPhotoLayer = new TileLayer();
const kartverketLayer = new TileLayer();

const polarLayer = new TileLayer();

export function BaseLayerDropdown() {
  const { setBaseLayer, map } = useContext(MapContext);

  useEffect(() => {
    loadKartverket().then((source) => kartverketLayer.setSource(source));
    loadFlyfotoLayer().then((source) => ortoPhotoLayer.setSource(source));
    loadPolar().then((source) => polarLayer.setSource(source));
  }, []);

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
    {
      id: "kartverket",
      name: "Kartverket",
      layer: kartverketLayer,
    },
    {
      id: "ortophoto",
      name: "Flyfoto",
      layer: ortoPhotoLayer,
    },
    {
      id: "polar",
      name: "Arktisk",
      layer: polarLayer,
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
      {map.getView().getProjection().getCode()}
      {selectedLayer.layer.getSource()?.getProjection()?.getCode()}
    </div>
  );
}
