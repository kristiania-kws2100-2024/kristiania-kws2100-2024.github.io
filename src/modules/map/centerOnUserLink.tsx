import { View } from "ol";
import React from "react";

export function CenterOnUserLink({ view }: { view: View }) {
  function handleClick(e: React.MouseEvent) {
    e.preventDefault();
    navigator.geolocation.getCurrentPosition((pos) => {
      const { latitude, longitude } = pos.coords;
      view.animate({ center: [longitude, latitude], zoom: 12 });
    });
  }

  return (
    <a href={"#"} onClick={handleClick}>
      Center on me
    </a>
  );
}
