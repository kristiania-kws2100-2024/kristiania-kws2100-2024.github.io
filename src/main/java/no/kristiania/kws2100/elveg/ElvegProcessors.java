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
        public void close() throws Exception {
            statement.executeBatch();
            statement.close();
        }
    }


    static class VeglenkeProcessor extends AbstractElvegProcessor {
        public VeglenkeProcessor(Connection connection) throws SQLException {
            super(connection.prepareStatement("insert into veglenke (kommunenummer, id, type_veg) values (?, ?, ?)"));
        }

        @Override
        public void process(Element element) throws SQLException {
            var veglenke = readElvegElement(element);
            writeElvegElement(veglenke);
        }

        private void writeElvegElement(Elveg.Veglenke veglenke) throws SQLException {
            statement.setString(1, veglenke.getKommunenummer());
            statement.setString(2, veglenke.getId());
            statement.setString(3, veglenke.getTypeVeg());
            addBatch();
        }

        private Elveg.Veglenke readElvegElement(Element element) {
            return new Elveg.Veglenke()
                    .setKommunenummer(textOrNull(element.find("kommunenummer")))
                    //.setId(textOrNull(element.find("identifikasjon", "Identifikasjon", "lokalId")))
                    .setId(element.attr(Gml.NS.name("id")))
                    .setDetaljnivå(textOrNull(element.find("detaljnivå")))
                    .setTypeVeg(element.find("typeVeg").first().text())
                    .setFeltoversikt(textOrNull(element.find("feltoversikt")))
                    .setKonnekteringslenke("true".equals(element.find("konnekteringslenke").first().text()))
                    .setSenterlinje(Gml.GmlLineString.fromXml(element.find("senterlinje", "*").single()));
        }
    }

    public static class FartsgrenseProcessor extends AbstractElvegProcessor {
        FartsgrenseProcessor(Connection connection) throws SQLException {
            super(connection.prepareStatement("insert into fartsgrense (id, verdi) values (?, ?)"));
        }

        @Override
        public void process(Element element) throws SQLException {
            var fartsgrense = readElvegElement(element);
            writeElvegElement(fartsgrense);
        }

        private void writeElvegElement(Elveg.Fartsgrense fartsgrense) throws SQLException {
            statement.setString(1, fartsgrense.getId());
            statement.setString(2, fartsgrense.getFartsgrenseVerdi());
            addBatch();
        }

        private Elveg.Fartsgrense readElvegElement(Element element) {
            return new Elveg.Fartsgrense()
                    .setId(element.attr(Gml.NS.name("id")))
                    .setFartsgrenseVerdi(textOrNull(element.find("fartgrenseVerdi")))
                    .setSenterlinje(Gml.GmlLineString.fromXml(element.find("senterlinje", "*").single()));
        }
    }
}
