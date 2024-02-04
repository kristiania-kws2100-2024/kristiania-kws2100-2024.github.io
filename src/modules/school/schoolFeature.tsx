import { Feature } from "ol";
import { Point } from "ol/geom";

export type SchoolFeature = {
  getProperties(): SchoolProperties;
} & Feature<Point>;

interface SchoolProperties {
  navn: string;
  antall_elever: number;
  antall_ansatte: number;
  laveste_trinn: number;
  hoyeste_trinn: number;
  eierforhold: "Offentlig" | "Privat";
  kommunenummer: string;
}
