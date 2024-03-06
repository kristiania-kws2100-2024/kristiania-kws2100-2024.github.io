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


    private static abstract class AbstractElvegMapperProcessor<T> extends AbstractElvegProcessor {
        private final Db.TableMapper<T> tableMapper;

        public AbstractElvegMapperProcessor(Connection connection, Db.TableMapper<T> tableMapper) throws SQLException {
            super(tableMapper.prepareStatement(connection));
            this.tableMapper = tableMapper;
        }

        @Override
        public final void process(Element element) throws SQLException {
            tableMapper.setParameters(statement, readElvegElement(element));
            addBatch();
        }

        protected abstract T readElvegElement(Element element);
    }

    static class VeglenkeProcessor extends AbstractElvegMapperProcessor<Elveg.Veglenke> {
        public VeglenkeProcessor(Connection connection) throws SQLException {
            super(connection, Db.tableMapper("veglenke", Db.columnMapper(Elveg.Veglenke.class)
                    .primaryKey("kommunenummer", Elveg.Veglenke::getKommunenummer)
                    .primaryKey("id", Elveg.Veglenke::getId)
                    .column("lokal_id", Elveg.Veglenke::getLokalId)
                    .column("type_veg", Elveg.Veglenke::getTypeVeg)
                    .column("senterlinje", "ST_GeomFromEWKT(?)", l -> l.getSenterlinje().toEwkt())
            ));
        }

        protected Elveg.Veglenke readElvegElement(Element element) {
            /*
                        <lenkesekvens>
                <Lenkesekvensreferanse>
                    <identifikasjon>
                        <Identifikasjon>
                            <lokalId>922888</lokalId>
                            <navnerom>vegvesen.no.nvdb.rls</navnerom>
                        </Identifikasjon>
                    </identifikasjon>
                    <startposisjon>0.0</startposisjon>
                    <sluttposisjon>0.33000017</sluttposisjon>
                </Lenkesekvensreferanse>
            </lenkesekvens>

             */
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

    public static class FartsgrenseProcessor extends AbstractElvegMapperProcessor<Elveg.Fartsgrense> {
        FartsgrenseProcessor(Connection connection, String kommunenummer) throws SQLException {
            super(connection, Db.tableMapper("fartsgrense", Db.columnMapper(Elveg.Fartsgrense.class)
                            .primaryKey("kommunenummer", _ -> kommunenummer)
                            .primaryKey("id", Elveg.Fartsgrense::getId)
                            .column("lokal_id", Elveg.Fartsgrense::getLokalId)
                            .column("verdi", Elveg.Fartsgrense::getFartsgrenseVerdi)
                            .column("senterlinje", "ST_GeomFromEwkt(?)", l -> l.getSenterlinje().toEwkt())
            ));
            /*
                    .columns("pos_", mapper(Elveg.LineærPosisjonStrekning.class)
                            .column("id", Elveg.LineærPosisjonStrekning::getId)
                            .column("fra", Elveg.LineærPosisjonStrekning::getFra)
                            .column("til", Elveg.LineærPosisjonStrekning::getTil)
                            .column("retning", Elveg.LineærPosisjonStrekning::getRetning)
                    ));

             */
        }

        protected Elveg.Fartsgrense readElvegElement(Element element) {
            /*

                        <lineærPosisjon>
                <LineærPosisjonStrekning>
                    <lineærReferanseMetode>normalisert</lineærReferanseMetode>
                    <retning>med</retning>
                    <lenkesekvens>
                        <Identifikasjon>
                            <lokalId>930272</lokalId>
                            <navnerom>vegvesen.no.nvdb.rls</navnerom>
                        </Identifikasjon>
                    </lenkesekvens>
                    <fraPosisjon>0.0</fraPosisjon>
                    <tilPosisjon>1.0</tilPosisjon>
                </LineærPosisjonStrekning>
            </lineærPosisjon>

             */
            return new Elveg.Fartsgrense()
                    .setId(element.attr(Gml.NS.name("id")))
                    .setLokalId(textOrNull(element.find("identifikasjon", "Identifikasjon", "lokalId")))
                    .setFartsgrenseVerdi(textOrNull(element.find("fartsgrenseVerdi")))
                    .setSenterlinje(Gml.GmlLineString.fromXml(element.find("senterlinje", "*").single()));
        }
    }

    public static class FunksjonellVegklasseProcessor extends AbstractElvegMapperProcessor<Elveg.FunksjonellVegklasse> {
        public FunksjonellVegklasseProcessor(Connection connection, String kommunenummer) throws SQLException {
            super(connection, Db.tableMapper("funksjonell_vegklasse", Db.columnMapper(Elveg.FunksjonellVegklasse.class)
                    .primaryKey("kommunenummer", _ -> kommunenummer)
                    .primaryKey("id", Elveg.FunksjonellVegklasse::getId)
                    .column("lokal_id", Elveg.FunksjonellVegklasse::getLokalId)
                    .column("vegklasse", Elveg.FunksjonellVegklasse::getVegklasse)
                    .column("senterlinje", "ST_GeomFromEWKT(?)", l -> l.getSenterlinje().toEwkt())
            ));
        }

        protected Elveg.FunksjonellVegklasse readElvegElement(Element element) {
            /*

                        <lineærPosisjon>
                <LineærPosisjonStrekning>
                    <lineærReferanseMetode>normalisert</lineærReferanseMetode>
                    <retning>med</retning>
                    <lenkesekvens>
                        <Identifikasjon>
                            <lokalId>930690</lokalId>
                            <navnerom>vegvesen.no.nvdb.rls</navnerom>
                        </Identifikasjon>
                    </lenkesekvens>
                    <fraPosisjon>0.0</fraPosisjon>
                    <tilPosisjon>0.15632936</tilPosisjon>
                </LineærPosisjonStrekning>
            </lineærPosisjon>
*/
            return new Elveg.FunksjonellVegklasse()
                    .setId(element.attr(Gml.NS.name("id")))
                    .setLokalId(textOrNull(element.find("identifikasjon", "Identifikasjon", "lokalId")))
                    .setVegklasse(Integer.parseInt(element.find("vegklasse").single().text()))
                    .setSenterlinje(Gml.GmlLineString.fromXml(element.find("senterlinje", "*").single()));
        }
    }
}
