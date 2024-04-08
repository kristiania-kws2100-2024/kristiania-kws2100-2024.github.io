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
        fill: new Fill({ color: "blue" }),
        stroke: new Stroke({ color: "dark blue", width: 3 }),
      }),
    }),
    ...(resolution < 640
      ? [
          new Style({
            image: new Icon({
              src: "/icons/directions_boat.png",
              width: radius * 1.5,
            }),
          }),
        ]
      : []),
  ];
}

export function DrawFerryButton({ source, map }: DrawingProps) {
  const draw = useMemo(() => new Draw({ source, type: "Point" }), [source]);

  function handleClick() {
    map.addInteraction(draw);
  }

  function handleAddFeature(e: VectorSourceEvent) {
    e.feature?.setStyle(trainStationStyle);
    map.removeInteraction(draw);
  }

  useEffect(() => {
    source.on("addfeature", handleAddFeature);
    return () => source.un("addfeature", handleAddFeature);
  }, []);

  return <button onClick={handleClick}>Draw ferry</button>;
}
