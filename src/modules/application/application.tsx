import React, { MutableRefObject, useEffect, useRef, useState } from "react";
import TileLayer from "ol/layer/Tile";
import { OSM } from "ol/source";

import "./application.css";
import "ol/ol.css";
import { KommuneLayerCheckbox } from "../kommune/kommuneLayerCheckbox";
import { Layer } from "ol/layer";
import { map, MapContext } from "../map/mapContext";
import { KommuneAside } from "../kommune/kommuneAside";
import { FylkeLayerCheckbox } from "../fylke/fylkeLayerCheckbox";
import { FylkeAside } from "../fylke/fylkeAside";
import { CountryLayerCheckbox } from "../countries/countryLayerCheckbox";
import { CountryAside } from "../countries/countryAside";
import { StationLayerCheckbox } from "../stations/stationLayerCheckbox";
import { StationAside } from "../stations/stationAside";

export function Application() {
  function handleFocusUser(e: React.MouseEvent) {
    e.preventDefault();
    navigator.geolocation.getCurrentPosition((pos) => {
      const { latitude, longitude } = pos.coords;
      map.getView().animate({
        center: [longitude, latitude],
        zoom: 10,
      });
    });
  }
  const [layers, setLayers] = useState<Layer[]>([
    new TileLayer({ source: new OSM() }),
  ]);
  const mapRef = useRef() as MutableRefObject<HTMLDivElement>;
  useEffect(() => map.setTarget(mapRef.current), []);
  useEffect(() => map.setLayers(layers), [layers]);
  return (
    <MapContext.Provider value={{ map, layers, setLayers }}>
      <header>
        <h1>Kommune kart</h1>
      </header>
      <nav>
        <a href={"#"} onClick={handleFocusUser}>
          Focus on me
        </a>
        <CountryLayerCheckbox />
        <FylkeLayerCheckbox />
        <KommuneLayerCheckbox />
        <StationLayerCheckbox />
      </nav>
      <main>
        <div ref={mapRef}></div>
        <CountryAside />
        <FylkeAside />
        <KommuneAside />
        <StationAside />
      </main>
    </MapContext.Provider>
  );
}
