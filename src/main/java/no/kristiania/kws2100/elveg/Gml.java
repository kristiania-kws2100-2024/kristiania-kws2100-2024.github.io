package no.kristiania.kws2100.elveg;

import lombok.Data;
import org.eaxy.Element;
import org.eaxy.Namespace;

import java.util.ArrayList;
import java.util.List;

public class Gml {
    public static final String ELVEG_DISTRIBUTION_URL = "https://kartkatalog.geonorge.no/metadata/elveg-20/77944f7e-3d75-4f6d-ae04-c528cc72e8f6";
    static final Namespace NS = new Namespace("http://www.opengis.net/gml/3.2", "gml");

    @Data
    public static class GmlLineString {
        private final List<GmlPoint> positions;
        private String id, srsName;
        private int srsDimension;

        public static GmlLineString fromXml(Element gmlLineString) {
            var srsDimension = Integer.parseInt(gmlLineString.attr("srsDimension"));
            var posList = gmlLineString.find("posList").single().text().split("\\s+");
            var positions = new ArrayList<GmlPoint>();
            for (int i = 0; i < posList.length; i += srsDimension) {
                positions.add(new GmlPoint(posList, i, srsDimension));
            }
            return new GmlLineString(positions)
                    .setId(gmlLineString.attr("id"))
                    .setSrsName(gmlLineString.attr("srsName"))
                    .setSrsDimension(srsDimension);
        }
    }

    @Data
    public static class GmlPoint {
        private final double x, y, z;

        public GmlPoint(String[] posList, int offset, int dimensions) {
            if (dimensions < 2 || 3 < dimensions) {
                throw new IllegalArgumentException("Invalid dimensions " + dimensions);
            }
            this.x = Double.parseDouble(posList[offset]);
            this.y = Double.parseDouble(posList[offset + 1]);
            this.z = dimensions == 3 ? Double.parseDouble(posList[offset + 2]) : 0;
        }
    }
}
