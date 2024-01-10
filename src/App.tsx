import './App.css'
import "ol/ol.css";

import {Map, View} from "ol";
import {MutableRefObject, useEffect, useMemo, useRef} from "react";
import TileLayer from "ol/layer/Tile";
import {OSM} from "ol/source";
import {useGeographic} from "ol/proj";


useGeographic();



function App() {
  const map = useMemo(() => new Map({
    layers: [
      new TileLayer({source: new OSM()})
    ],
    view: new View({
      center: [10.5, 59.7], zoom: 11
    })
  }), []);


  const mapRef = useRef() as MutableRefObject<HTMLDivElement>;

  useEffect(() => {
    map.setTarget(mapRef.current)
  }, []);

  return (
    <div className={"map"} ref={mapRef}></div>
  )
}

export default App
