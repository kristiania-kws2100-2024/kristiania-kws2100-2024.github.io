import React from "react";
import VectorSource from "ol/source/Vector";
import { Map } from "ol";
import { Draw } from "ol/interaction";

export function DrawTrainStationButton({
  source,
  map,
}: {
  source: VectorSource;
  map: Map;
}) {
  function handleClick() {
    map.addInteraction(
      new Draw({
        source,
        type: "Point",
      }),
    );
  }

  return <button onClick={handleClick}>Draw train station</button>;
}
