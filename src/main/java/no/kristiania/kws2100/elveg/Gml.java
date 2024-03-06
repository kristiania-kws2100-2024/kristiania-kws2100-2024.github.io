package no.kristiania.kws2100.elveg;

import lombok.Data;
import org.eaxy.Element;
import org.eaxy.Namespace;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

public class Gml {
    public static final String ELVEG_DISTRIBUTION_URL = "https://kartkatalog.geonorge.no/metadata/elveg-20/77944f7e-3d75-4f6d-ae04-c528cc72e8f6";
    static final Namespace NS = new Namespace("http://www.opengis.net/gml/3.2", "gml");

    @Data
    public static class GmlLineString {
        private final List<GmlPoint3d> positions;
        private String id, srsName;
        private int srsDimension;

        public static GmlLineString fromXml(Element gmlLineString) {
            var srsDimension = Integer.parseInt(gmlLineString.attr("srsDimension"));
            if (srsDimension != 3) {
                throw new IllegalArgumentException("Not yet supported");
            }
            var posList = gmlLineString.find("posList").single().text().split("\\s+");
            var positions = new ArrayList<GmlPoint3d>();
            for (int i = 0; i < posList.length; i += srsDimension) {
                positions.add(new GmlPoint3d(posList, i));
            }
            return new GmlLineString(positions)
                    .setId(gmlLineString.attr("id"))
                    .setSrsName(gmlLineString.attr("srsName"))
                    .setSrsDimension(srsDimension);
        }

        public String toEwkt() {
            return STR."LINESTRING(\{positions.stream().map(GmlPoint3d::toEwktInner).collect(Collectors.joining(", "))})";
        }
    }

    @Data
    public static class GmlPoint3d {
        private final double x, y, z;

        public GmlPoint3d(String[] posList, int offset) {
            this.x = Double.parseDouble(posList[offset]);
            this.y = Double.parseDouble(posList[offset + 1]);
            this.z = Double.parseDouble(posList[offset + 2]);
        }

        public String toEwktInner() {
            return STR."\{x} \{y} \{z}";
        }
    }
}
