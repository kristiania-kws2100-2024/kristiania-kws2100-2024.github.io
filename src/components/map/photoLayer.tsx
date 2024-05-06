import TileLayer from "ol/layer/Tile";
import { loadWtmsSource } from "./loadWtmsSource";

export const photoLayer = new TileLayer();

async function loadPhotoLayer() {
  return await loadWtmsSource(
    "https://opencache.statkart.no/gatekeeper/gk/gk.open_nib_web_mercator_wmts_v2?SERVICE=WMTS&REQUEST=GetCapabilities",
    {
      layer: "Nibcache_web_mercator_v2",
      matrixSet: "default028mm",
    },
  );
}
loadPhotoLayer().then((source) => photoLayer.setSource(source));
