import React from "react";

export function formatCoordinates(latLon: {
  latitude: number;
  longitude: number;
}) {
  const { latitude, longitude } = latLon;
  return `${latitude.toFixed(4)}°${latitude >= 0 ? "N" : "S"} ${longitude.toFixed(4)}°${longitude >= 0 ? "E" : "W"}`;
}

export function Coordinates(
  props:
    | {
        latitudeLongitude: { latitude: number; longitude: number } | undefined;
      }
    | { coordinates: number[] },
) {
  if ("latitudeLongitude" in props && props.latitudeLongitude) {
    const { latitude, longitude } = props.latitudeLongitude;
    return (
      <span title={`${latitude} ${longitude}`}>
        {formatCoordinates(props.latitudeLongitude)}
      </span>
    );
  } else if ("coordinates" in props) {
    const [longitude, latitude] = props.coordinates;
    return (
      <Coordinates
        latitudeLongitude={{
          latitude,
          longitude,
        }}
      />
    );
  } else {
    return <span>No position</span>;
  }
}

export function metersBetween(coordinate1: number[], coordinate2: number[]) {
  const [lon1, lat1] = coordinate1;
  const [lon2, lat2] = coordinate2;
  const r = 6371 * 1000; // radius of earth
  const p = Math.PI / 180;

  const a =
    0.5 -
    Math.cos((lat2 - lat1) * p) / 2 +
    (Math.cos(lat1 * p) *
      Math.cos(lat2 * p) *
      (1 - Math.cos((lon2 - lon1) * p))) /
      2;

  return 2 * r * Math.asin(Math.sqrt(a));
}
