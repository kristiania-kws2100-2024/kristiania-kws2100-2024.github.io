import { Feature } from "ol";
import { Point } from "ol/geom";
import { FeatureLike } from "ol/Feature";
import { Circle, Fill, Stroke, Style } from "ol/style";

export type SchoolFeature = {
  getProperties(): SchoolProperties;
} & Feature<Point>;

export interface SchoolProperties {
  navn: string;
  antall_elever: number;
  antall_ansatte: number;
  laveste_trinn: number;
  hoyeste_trinn: number;
  eierforhold: "Offentlig" | "Privat";
  kommunenummer: string;
}

export const schoolStyle = (feature: FeatureLike) => {
  const school = feature.getProperties() as SchoolProperties;
  return new Style({
    image: new Circle({
      radius: 2 + school.antall_elever / 150,
      fill:
        school.eierforhold === "Offentlig"
          ? new Fill({ color: "blue" })
          : new Fill({ color: "purple" }),
      stroke: new Stroke({ color: "white" }),
    }),
  });
};

export const activeSchoolStyle = (feature: FeatureLike) => {
  const school = feature.getProperties() as SchoolProperties;
  return new Style({
    image: new Circle({
      radius: 2 + school.antall_elever / 150,
      fill:
        school.eierforhold === "Offentlig"
          ? new Fill({ color: "blue" })
          : new Fill({ color: "purple" }),
      stroke: new Stroke({ color: "white", width: 3 }),
    }),
  });
};
