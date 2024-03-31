export function sortBy<T>(fn: (f: T) => number) {
  return function (p1: T, p2: T) {
    return fn(p1) - fn(p2);
  };
}
