package no.kristiania.kws2100.elveg;

import lombok.Data;
import org.eaxy.Namespace;

public class Elveg {
    static final Namespace NS = new Namespace("http://skjema.geonorge.no/SOSI/produktspesifikasjon/Elveg/2.0");

    @Data
    public static class Veglenke {
        private String kommunenummer, id, lokalId, typeVeg, detaljnivå, feltoversikt;
        private boolean konnekteringslenke;
        private Gml.GmlLineString senterlinje;
        private Veglenkeadresse veglenkeadresse;
    }

    @Data
    public static class Fartsgrense {
        private String id, lokalId, fartsgrenseVerdi;
        private LineærPosisjonStrekning lineærPosisjon;
        private Gml.GmlLineString senterlinje;
    }

    @Data
    public static class FunksjonellVegklasse {
        private String id, lokalId;
        private int vegklasse;
        private LineærPosisjonStrekning lineærPosisjon;
        private Gml.GmlLineString senterlinje;
    }

    @Data
    public static class LineærPosisjonStrekning {
        private String retning;
        private String lenkeSekvens;
        private double fraPosisjon, tilPosisjon;
    }

    @Data
    public static class Veglenkeadresse {
        private Long adressekode;
        private String adressenavn;
        private Boolean sideveg;
    }
}
