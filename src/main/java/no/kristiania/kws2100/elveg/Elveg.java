package no.kristiania.kws2100.elveg;

import lombok.Data;

public class Elveg {
    @Data
    public static class Veglenke {
        private String typeVeg, detaljnivå, feltoversikt;
        private boolean konnekteringslenke;
        private Gml.GmlLineString senterlinje;
    }

    @Data
    public static class Fartsgrense {
        private String id, fartsgrenseVerdi;
        private Gml.GmlLineString senterlinje;
    }
}
