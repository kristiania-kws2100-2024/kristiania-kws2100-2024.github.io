import './App.css'
import "ol/ol.css";

import {Map, View} from "ol";
import {MutableRefObject, useEffect, useMemo, useRef} from "react";
import TileLayer from "ol/layer/Tile";
import {OSM} from "ol/source";
import {useGeographic} from "ol/proj";


useGeographic();



function App() {
  const view = useMemo(() => new View({
    center: [10.5, 59.7], zoom: 11
  }), []);
  const map = useMemo(() => new Map({
    layers: [
      new TileLayer({source: new OSM()})
    ],
    view: view
  }), []);

  function handleZoomToUser(e: React.MouseEvent) {
    e.preventDefault();

    navigator.geolocation.getCurrentPosition((pos) => {
      const { longitude, latitude } = pos.coords;
      const center = [longitude, latitude];
      map.getView().animate({ center, zoom: 14 });
    })
  }

  function handleZoomToNorway(e: React.MouseEvent) {
    e.preventDefault();

    map.getView().animate({
      center: [15, 65], zoom: 5
    })
  }

  const mapRef = useRef() as MutableRefObject<HTMLDivElement>;

  useEffect(() => {
    map.setTarget(mapRef.current)
  }, []);

  return (
      <>
      <header><h1>Kristiania mapping application</h1></header>
        <nav>
          <a href={"#"} onClick={handleZoomToUser}>Zoom to my location</a>
          <a href={"#"} onClick={handleZoomToNorway}>Show all of Norway</a>
        </nav>
    <div className={"map"} ref={mapRef}></div>
      </>
  )
}

export default App
