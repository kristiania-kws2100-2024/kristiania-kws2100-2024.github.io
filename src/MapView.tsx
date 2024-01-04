import {Map} from "ol";
import {MutableRefObject, useEffect, useRef} from "react";

export function MapView({map}: { map: Map }) {
    const mapRef = useRef() as MutableRefObject<HTMLDivElement>;

    useEffect(() => {
        map.setTarget(mapRef.current);
    }, []);

    return <div ref={mapRef}></div>;
}