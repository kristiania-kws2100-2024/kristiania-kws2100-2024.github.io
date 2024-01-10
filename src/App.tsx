import './App.css'
import {Map, View} from "ol";
import {MutableRefObject, useEffect, useRef} from "react";
import TileLayer from "ol/layer/Tile";
import {OSM} from "ol/source";
import {useGeographic} from "ol/proj";


useGeographic();

const map = new Map({
  layers: [
      new TileLayer({source: new OSM()})
  ],
  view: new View({
    center: [10.5, 59.7], zoom: 10
  })
});



function App() {
  const mapRef = useRef() as MutableRefObject<HTMLDivElement>;

  useEffect(() => {
    map.setTarget(mapRef.current)
  }, []);

  return (
    <div className={"map"} ref={mapRef}>I am a map</div>
  )
}

export default App
