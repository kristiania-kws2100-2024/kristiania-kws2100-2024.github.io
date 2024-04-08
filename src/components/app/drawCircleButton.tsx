import { DrawingProps } from "./drawingProps";
import React, { useMemo } from "react";
import { Draw } from "ol/interaction";
import { VectorSourceEvent } from "ol/source/Vector";

export function DrawCircleButton({ source, map }: DrawingProps) {
  const draw = useMemo(() => new Draw({ source, type: "Circle" }), [source]);

  function handleClick() {
    map.addInteraction(draw);
    source.once("addfeature", handleAddFeature);
  }

  function handleAddFeature(e: VectorSourceEvent) {
    map.removeInteraction(draw);
  }

  return <button onClick={handleClick}>Draw circle</button>;
}
