package no.kristiania.kws2100.elveg;

import org.eaxy.Element;
import org.eaxy.ElementSet;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;

public class ElvegProcessors {

    abstract static class AbstractElvegProcessor implements ElementProcessor {
        private int batchSize = 0;
        protected final PreparedStatement statement;

        AbstractElvegProcessor(PreparedStatement statement) {
            this.statement = statement;
        }

        protected String textOrNull(ElementSet elementSet) {
            return elementSet.isPresent() ? elementSet.first().text() : null;
        }

        protected void addBatch() throws SQLException {
            statement.addBatch();
            if (++batchSize % 1000 == 0) {
                statement.executeBatch();
            }
        }

        @Override
        public void close() throws SQLException {
            statement.executeBatch();
            statement.close();
        }
    }


    static class VeglenkeProcessor extends AbstractElvegProcessor {
        public VeglenkeProcessor(Connection connection) throws SQLException {
            super(connection.prepareStatement("insert into veglenke (kommunenummer, id, lokal_id, type_veg, senterlinje) values (?, ?, ?, ?, st_geomfromewkt(?))"));
        }

        @Override
        public void process(Element element) throws SQLException {
            var veglenke = readElvegElement(element);
            writeElvegElement(veglenke);
        }

        private void writeElvegElement(Elveg.Veglenke veglenke) throws SQLException {
            statement.setString(1, veglenke.getKommunenummer());
            statement.setString(2, veglenke.getId());
            statement.setString(3, veglenke.getLokalId());
            statement.setString(4, veglenke.getTypeVeg());
            statement.setString(5, veglenke.getSenterlinje().toEwkt());
            addBatch();
        }

        private Elveg.Veglenke readElvegElement(Element element) {
            return new Elveg.Veglenke()
                    .setKommunenummer(textOrNull(element.find("kommunenummer")))
                    .setId(element.attr(Gml.NS.name("id")))
                    .setLokalId(textOrNull(element.find("identifikasjon", "Identifikasjon", "lokalId")))
                    .setDetaljnivå(textOrNull(element.find("detaljnivå")))
                    .setTypeVeg(element.find("typeVeg").first().text())
                    .setFeltoversikt(textOrNull(element.find("feltoversikt")))
                    .setKonnekteringslenke("true".equals(element.find("konnekteringslenke").first().text()))
                    .setSenterlinje(Gml.GmlLineString.fromXml(element.find("senterlinje", "*").single()));
        }
    }

    public static class FartsgrenseProcessor extends AbstractElvegProcessor {
        private final String kommunenummer;

        FartsgrenseProcessor(Connection connection, String kommunenummer) throws SQLException {
            super(connection.prepareStatement("insert into fartsgrense (kommunenummer, id, lokal_id, verdi, senterlinje) values (?, ?, ?, ?, st_geomfromewkt(?))"));
            this.kommunenummer = kommunenummer;
        }

        @Override
        public void process(Element element) throws SQLException {
            var fartsgrense = readElvegElement(element);
            writeElvegElement(fartsgrense);
        }

        private void writeElvegElement(Elveg.Fartsgrense fartsgrense) throws SQLException {
            statement.setString(1, kommunenummer);
            statement.setString(2, fartsgrense.getId());
            statement.setString(3, fartsgrense.getLokalId());
            statement.setString(4, fartsgrense.getFartsgrenseVerdi());
            statement.setString(5, fartsgrense.getSenterlinje().toEwkt());
            addBatch();
        }

        private Elveg.Fartsgrense readElvegElement(Element element) {
            return new Elveg.Fartsgrense()
                    .setId(element.attr(Gml.NS.name("id")))
                    .setLokalId(textOrNull(element.find("identifikasjon", "Identifikasjon", "lokalId")))
                    .setFartsgrenseVerdi(textOrNull(element.find("fartsgrenseVerdi")))
                    .setSenterlinje(Gml.GmlLineString.fromXml(element.find("senterlinje", "*").single()));
        }
    }

    public static class FunksjonellVegklasseProcessor extends AbstractElvegProcessor {
        private final String kommunenummer;

        public FunksjonellVegklasseProcessor(Connection connection, String kommunenummer) throws SQLException {
            super(connection.prepareStatement("insert into funksjonell_vegklasse (kommunenummer, id, lokal_id, vegklasse, senterlinje) values (?, ?, ?, ?, st_geomfromewkt(?))"));
            this.kommunenummer = kommunenummer;
        }

        @Override
        public void process(Element element) throws SQLException {
            var vegklasse = readElvegElement(element);
            writeElvegElement(vegklasse);
        }

        private void writeElvegElement(Elveg.FunksjonellVegklasse fartsgrense) throws SQLException {
            statement.setString(1, kommunenummer);
            statement.setString(2, fartsgrense.getId());
            statement.setString(3, fartsgrense.getLokalId());
            statement.setInt(4, fartsgrense.getVegklasse());
            statement.setString(5, fartsgrense.getSenterlinje().toEwkt());
            addBatch();
        }

        private Elveg.FunksjonellVegklasse readElvegElement(Element element) {
            return new Elveg.FunksjonellVegklasse()
                    .setId(element.attr(Gml.NS.name("id")))
                    .setLokalId(textOrNull(element.find("identifikasjon", "Identifikasjon", "lokalId")))
                    .setVegklasse(Integer.parseInt(element.find("vegklasse").single().text()))
                    .setSenterlinje(Gml.GmlLineString.fromXml(element.find("senterlinje", "*").single()));
        }
    }
}
