import React, { MutableRefObject, useEffect, useRef } from "react";
import { Map, View } from "ol";
import TileLayer from "ol/layer/Tile";
import { OSM } from "ol/source";
import { useGeographic } from "ol/proj";

// By calling the "useGeographic" function in OpenLayers, we tell that we want coordinates to be in degrees
//  instead of meters, which is the default. Without this `center: [11, 60]` doesn't work on the view
useGeographic();

// Here we create a Map object. Make sure you `import { Map } from "ol"` or otherwise, standard Javascript
//  map data structure will be used
const map = new Map({
  // The map will be centered on 60 degrees latitude and 11 degrees longitude, with a certain zoom level
  view: new View({ center: [11, 60], zoom: 10 }),
  // images displayed on the map will be from the Open Street Map (OSM) tile layer
  layers: [new TileLayer({ source: new OSM() })],
});

// A functional React component
export function Application() {
  // `useRef` bridges the gap between JavaScript functions that expect DOM objects and React components
  // `as MutableRefObject` is required by TypeScript to avoid us binding the wrong ref to the wrong component
  const mapRef = useRef() as MutableRefObject<HTMLDivElement>;

  // When we display the page, we want the OpenLayers map object to target the DOM object refererred to by the
  // map React component
  useEffect(() => {
    map.setTarget(mapRef.current);
  }, []);

  // This is the location (in React) where we want the map to be displayed
  return <div ref={mapRef}></div>;
}
