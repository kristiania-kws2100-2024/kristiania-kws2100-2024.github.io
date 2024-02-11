import React, {
  MutableRefObject,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import TileLayer from "ol/layer/Tile";
import { OSM } from "ol/source";

import "./application.css";
import "ol/ol.css";
import { KommuneLayerCheckbox } from "../kommune/kommuneLayerCheckbox";
import { map, MapContext } from "../map/mapContext";
import { Layer } from "ol/layer";
import { KommuneAside } from "../kommune/kommuneAside";
import { FylkeLayerCheckbox } from "../fylke/fylkeLayerCheckbox";
import { FylkeAside } from "../fylke/fylkeAside";
import { SchoolLayerCheckbox } from "../school/schoolLayerCheckbox";
import { SchoolAside } from "../school/schoolAside";
import { BaselayerSelector } from "../baselayer/baselayerSelector";
import { View } from "ol";

export function Application() {
  function handleFocusUser(e: React.MouseEvent) {
    e.preventDefault();
    navigator.geolocation.getCurrentPosition((pos) => {
      const { latitude, longitude } = pos.coords;
      map.getView().animate({
        center: [longitude, latitude],
        zoom: 12,
      });
    });
  }

  const [view, setView] = useState(new View({ center: [10, 59], zoom: 8 }));
  useEffect(() => map.setView(view), [view]);
  const [baseLayer, setBaseLayer] = useState<Layer>(
    new TileLayer({ source: new OSM() }),
  );
  const [featureLayers, setFeatureLayers] = useState<Layer[]>([]);
  const layers = useMemo(
    () => [baseLayer, ...featureLayers],
    [baseLayer, featureLayers],
  );
  const projection = useMemo(
    () => baseLayer.getSource()!.getProjection(),
    [baseLayer],
  );
  useEffect(() => {
    if (projection)
      setView(
        (old) =>
          new View({
            center: old.getCenter(),
            zoom: old.getZoom(),
            projection: projection,
          }),
      );
  }, [projection]);
  useEffect(() => map.setLayers(layers), [layers]);

  const mapRef = useRef() as MutableRefObject<HTMLDivElement>;
  useEffect(() => map.setTarget(mapRef.current), []);
  return (
    <MapContext.Provider
      value={{ map, featureLayers, setFeatureLayers, setBaseLayer }}
    >
      <header>
        <h1>Kommune kart</h1>
      </header>
      <nav>
        <BaselayerSelector />
        {projection?.getCode()}
        <a href={"#"} onClick={handleFocusUser}>
          Focus on me
        </a>
        <KommuneLayerCheckbox />
        <FylkeLayerCheckbox />
        <SchoolLayerCheckbox />
      </nav>
      <main>
        <div ref={mapRef}></div>
        <FylkeAside />
        <KommuneAside />
        <SchoolAside />
      </main>
    </MapContext.Provider>
  );
}
