export interface KommuneProperties {
  kommunenummer: string;
  navn: { sprak: string; navn: string }[];
}

export function getKommuneNavn(k: KommuneProperties) {
  return k.navn.find((n) => n.sprak === "nor")!.navn;
}
