import { WMTSCapabilities } from "ol/format";
import { WMTS } from "ol/source";
import { optionsFromCapabilities } from "ol/source/WMTS";

export async function loadWtmsSource(
  url: string,
  config: { matrixSet: string; layer: string },
) {
  const parser = new WMTSCapabilities();
  const res = await fetch(url);
  const text = await res.text();
  const result = parser.read(text);
  return new WMTS(optionsFromCapabilities(result, config)!);
}
