import React from "react";

export function Time({ epocSeconds }: { epocSeconds: number | undefined }) {
  if (!epocSeconds) {
    return <span>No time</span>;
  }
  const date = new Date(epocSeconds * 1000);
  return (
    <time dateTime={date.toISOString()} title={date.toISOString()}>
      {date.toTimeString().split(" ")[0]}
    </time>
  );
}
