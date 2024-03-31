import React from "react";

export function Time(
  props: { epocSeconds: number | undefined } | { date: Date },
) {
  if ("epocSeconds" in props && props.epocSeconds) {
    const date = new Date(props.epocSeconds * 1000);
    return <Time date={date} />;
  } else if ("date" in props) {
    const { date } = props;
    return (
      <time dateTime={date.toISOString()} title={date.toISOString()}>
        {date.toTimeString().split(" ")[0]}
      </time>
    );
  } else {
    return <span>No time</span>;
  }
}
