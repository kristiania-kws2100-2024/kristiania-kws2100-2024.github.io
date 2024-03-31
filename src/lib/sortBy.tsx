export function sortBy<T>(fn: (o: T) => number) {
  return (p1: T, p2: T) => fn(p1) - fn(p2);
}
