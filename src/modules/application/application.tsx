import React, { useState } from "react";
import { MapContextProvider } from "../map/mapContext";
import { MapView } from "../map/mapView";
import { MapNav } from "../map/mapNav";

import "./application.css";
import "ol/ol.css";
import { KommuneProperties } from "../../kommune";

export function Application() {
  const [kommune, setKommune] = useState<KommuneProperties | undefined>(
    undefined,
  );

  return (
    <MapContextProvider>
      <header>
        <h1>
          Kristiania map
          {kommune && ` (${kommune.navn.find((n) => n.sprak === "nor")?.navn})`}
        </h1>
      </header>
      <MapNav setKommune={setKommune} />
      <main>
        <MapView />
      </main>
    </MapContextProvider>
  );
}
