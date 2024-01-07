export interface KommuneProperties {
  kommunenummer: string;
  navn: {
    navn: string;
    sprak: string;
  }[];
}

export function getKommuneName(k: KommuneProperties) {
  return k.navn.find((n) => n.sprak === "nor")?.navn!;
}
