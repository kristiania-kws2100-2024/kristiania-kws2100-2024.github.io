import React, { useEffect, useMemo } from "react";
import { VectorSourceEvent } from "ol/source/Vector";
import { Draw } from "ol/interaction";
import { Circle, Fill, Icon, Stroke, Style } from "ol/style";
import { FeatureLike } from "ol/Feature";
import { DrawingProps } from "./drawingProps";

function trainStationStyle(f: FeatureLike, resolution: number) {
  const radius = Math.min(6000 / resolution, 20);
  return [
    new Style({
      image: new Circle({
        radius,
        fill: new Fill({ color: "white" }),
        stroke: new Stroke({ color: "black", width: 3 }),
      }),
    }),
    ...(resolution < 500
      ? [
          new Style({
            image: new Icon({
              src: "/icons/train.png",
              width: radius * 1.5,
            }),
          }),
        ]
      : []),
  ];
}

export function DrawTrainStationButton({ source, map }: DrawingProps) {
  const draw = useMemo(() => new Draw({ source, type: "Point" }), [source]);

  function handleClick() {
    map.addInteraction(draw);
    source.once("addfeature", handleAddFeature);
  }

  function handleAddFeature(e: VectorSourceEvent) {
    e.feature?.setStyle(trainStationStyle);
    map.removeInteraction(draw);
  }

  return <button onClick={handleClick}>Draw train station</button>;
}
