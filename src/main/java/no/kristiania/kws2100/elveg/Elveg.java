package no.kristiania.kws2100.elveg;

import lombok.Data;
import org.eaxy.Namespace;

public class Elveg {
    static final Namespace NS = new Namespace("http://skjema.geonorge.no/SOSI/produktspesifikasjon/Elveg/2.0");

    @Data
    public static class Veglenke {
        private String kommunenummer, id, typeVeg, detaljnivå, feltoversikt;
        private boolean konnekteringslenke;
        private Gml.GmlLineString senterlinje;
    }

    @Data
    public static class Fartsgrense {
        private String id, fartsgrenseVerdi;
        private Gml.GmlLineString senterlinje;
    }
}
