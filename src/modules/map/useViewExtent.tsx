import { useContext, useEffect, useState } from "react";
import { MapContext } from "./mapContextProvider";

export function useViewExtent() {
  const { map } = useContext(MapContext);
  const [viewExtent, setViewExtent] = useState(
    () => map.getView().getViewStateAndExtent().extent,
  );

  function handleViewChange() {
    setViewExtent(map.getView().getViewStateAndExtent().extent);
  }

  useEffect(() => {
    map.getView().on("change", handleViewChange);
    handleViewChange();
    return () => map.getView().un("change", handleViewChange);
  }, [map.getView()]);
  return viewExtent;
}
