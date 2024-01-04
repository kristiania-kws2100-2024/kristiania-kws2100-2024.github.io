import {MutableRefObject, useEffect, useRef} from "react";
import {Map, View} from "ol";
import TileLayer from "ol/layer/Tile";
import {OSM} from "ol/source";
import {useGeographic} from "ol/proj";

useGeographic();
const map = new Map({
  view: new View({ center: [11, 60], zoom: 10, constrainResolution: true }),
  layers: [
      new TileLayer({source: new OSM()})
  ]
})

function App() {
  const mapRef = useRef() as MutableRefObject<HTMLDivElement>;

  useEffect(() => {
    map.setTarget(mapRef.current);
  }, []);

  return (
    <div ref={mapRef}></div>
  )
}

export default App
