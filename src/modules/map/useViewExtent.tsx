import { useContext, useEffect, useMemo, useState } from "react";
import { MapContext } from "./mapContext";

export function useViewExtent() {
  const { map } = useContext(MapContext);
  const [extent, setExtent] = useState(
    () => map.getView().getViewStateAndExtent().extent,
  );

  function setExtentFromView() {
    setExtent(map.getView().getViewStateAndExtent().extent);
  }

  useEffect(() => {
    map.getView().on("change", setExtentFromView);
    setExtentFromView();
    return () => {
      map.getView().un("change", setExtentFromView);
    };
  }, [map.getView()]);
  return extent;
}
