import React, { useEffect } from "react";
import VectorSource from "ol/source/Vector";
import { Map } from "ol";
import { Draw } from "ol/interaction";
import { Circle, Fill, Stroke, Style } from "ol/style";
import { FeatureLike } from "ol/Feature";

function trainStationStyle(f: FeatureLike, resolution: number) {
  console.log({ resolution });
  const radius = Math.min(6000 / resolution, 25);
  return new Style({
    image: new Circle({
      radius,
      fill: new Fill({ color: "white" }),
      stroke: new Stroke({ color: "black", width: 3 }),
    }),
  });
}

export function DrawTrainStationButton({
  source,
  map,
}: {
  source: VectorSource;
  map: Map;
}) {
  function handleClick() {
    map.addInteraction(new Draw({ source, type: "Point" }));
  }

  useEffect(() => {
    source.on("addfeature", (e) => {
      e.feature?.setStyle(trainStationStyle);
    });
  }, []);

  return <button onClick={handleClick}>Draw train station</button>;
}
