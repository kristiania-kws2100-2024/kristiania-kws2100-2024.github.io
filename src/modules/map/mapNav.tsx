import React, { ReactNode, useContext } from "react";
import { MapContext } from "./mapContext";
import { ToggleKommuneCheckbox } from "./toggleKommuneCheckbox";

function LinkButton({
  onClick,
  children,
}: {
  onClick(): void;
  children: ReactNode;
}) {
  function handleClick(e: React.MouseEvent) {
    e.preventDefault();
    onClick();
  }
  return (
    <a href={"#"} onClick={handleClick}>
      {children}
    </a>
  );
}

export function MapNav() {
  const { view } = useContext(MapContext);
  function handleShowNorway() {
    view.animate({ center: [16, 65], zoom: 5 });
  }
  function handleShowOslo() {
    view.animate({ center: [10.5, 59.8], zoom: 10 });
  }
  function handleZoomToUser() {
    navigator.geolocation.getCurrentPosition((pos) => {
      const { latitude, longitude } = pos.coords;
      view.animate({ center: [longitude, latitude], zoom: 14 });
    });
  }

  return (
    <nav>
      <LinkButton onClick={handleShowNorway}>Show Norway</LinkButton>
      <LinkButton onClick={handleShowOslo}>Show Oslo</LinkButton>
      <LinkButton onClick={handleZoomToUser}>Show my location</LinkButton>
      <ToggleKommuneCheckbox />
    </nav>
  );
}
