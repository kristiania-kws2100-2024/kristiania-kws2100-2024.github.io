import React from "react";

export function formatCoordinates(latLon: {
  latitude: number;
  longitude: number;
}) {
  const { latitude, longitude } = latLon;
  return `${latitude.toFixed(4)}°${latitude >= 0 ? "N" : "S"} ${longitude.toFixed(4)}°${longitude >= 0 ? "E" : "W"}`;
}

export function Coordinates({
  latitudeLongitude,
}: {
  latitudeLongitude: { latitude: number; longitude: number } | undefined;
}) {
  if (latitudeLongitude) {
    const { latitude, longitude } = latitudeLongitude;
    return (
      <span title={`${latitude} ${longitude}`}>
        {formatCoordinates(latitudeLongitude)}
      </span>
    );
  }
  return <span>No position</span>;
}
