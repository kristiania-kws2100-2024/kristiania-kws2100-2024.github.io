import VectorSource from "ol/source/Vector";
import { Map } from "ol";

export interface DrawingProps {
  source: VectorSource;
  map: Map;
}
