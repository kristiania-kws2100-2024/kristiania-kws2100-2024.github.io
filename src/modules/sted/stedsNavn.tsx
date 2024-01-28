export interface StedsNavn {
  sprak: "nor" | "sma" | "sme" | "smj" | "fkv";
  navn: string;
}

export function getStedsnavn({ navn }: { navn: StedsNavn[] }) {
  return navn.find((n) => n.sprak === "nor")!.navn;
}
