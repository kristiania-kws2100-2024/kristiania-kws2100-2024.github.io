import React, { useState } from "react";
import { MapContextProvider } from "../map/mapContext";
import { MapView } from "../map/mapView";
import { MapNav } from "../map/mapNav";

import "./application.css";
import "ol/ol.css";
import { KommuneAside } from "../kommune/kommuneAside";
import { getKommuneNavn, KommuneProperties } from "../kommune/kommune";

export function Application() {
  const [kommune, setKommune] = useState<KommuneProperties | undefined>(
    undefined,
  );

  return (
    <MapContextProvider>
      <header>
        <h1>
          Kristiania map
          {kommune && ` (${getKommuneNavn(kommune)})`}
        </h1>
      </header>
      <MapNav setKommune={setKommune} />
      <main>
        <MapView />
        <KommuneAside />
      </main>
    </MapContextProvider>
  );
}
