package no.kristiania.kws2100.elveg;

import org.eaxy.Element;
import org.eaxy.ElementSet;
import org.eaxy.Namespace;
import org.eaxy.Xml;
import org.postgresql.ds.PGSimpleDataSource;

import javax.sql.DataSource;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.nio.file.Files;
import java.nio.file.Path;
import java.sql.SQLException;
import java.util.Collections;
import java.util.Optional;
import java.util.TreeSet;
import java.util.zip.ZipFile;

public class ImportElveg {

    private static final Namespace GML = new Namespace("http://www.opengis.net/gml/3.2", "gml");

    public ImportElveg(DataSource dataSource) {

    }

    public static void main(String[] args) throws SQLException, IOException {
        var path = Path.of("target/Samferdsel_0000_Norge_5973_Elveg2-0_GML.zip");
        if (!Files.exists(path)) {
            System.out.printf("Please download Elveg 2.0 GML to %s from %s%n", path, Gml.ELVEG_DISTRIBUTION_URL);
            System.exit(1);
        }
        var dataSource = new PGSimpleDataSource();
        dataSource.setURL(Optional.ofNullable(System.getenv("JDBC_URL")).orElse("jdbc:postgresql:postgres"));
        dataSource.setUser(Optional.ofNullable(System.getenv("JDBC_USERNAME")).orElse("postgres"));

        dataSource.getConnection().close();

        try (var zipFile = new ZipFile(path.toFile())) {
            for (var zipEntry : Collections.list(zipFile.entries())) {
                if (zipEntry.getSize() < 10_000_000) {
                    System.out.println("Processing " + zipEntry);
                    try (var inputStream = zipFile.getInputStream(zipEntry)) {
                        new ImportElveg(dataSource).processElvegFile(inputStream);
                    }
                } else {
                    System.out.println("Skipping " + zipEntry);
                }
            }
        }
    }

    private void processElvegFile(InputStream inputStream) {
        var filter = Xml.filter("member", "*");
        for (var element : filter.iterate(new InputStreamReader(inputStream))) {
            switch (element.getName().getName()) {
                case "Beredskapsveg" -> processBeredskapsveg(element);
                case "Fartsgrense" -> processFartsgrense(element);
                case "FartsgrenseVariabel" -> processFartsgrenseVariabel(element);
                case "FunksjonellVegklasse" -> processFunksjonellVegklasse(element);
                case "Gågatereguleringer" -> processGågatereguleringer(element);
                case "Høydebegrensning" -> processHøydebegrensning(element);
                case "InnkjøringForbudt" -> processInnkjøringForbudt(element);
                case "Jernbanekryssing" -> processJernbanekryssing(element);
                case "Landbruksvegklasse" -> processLandbruksvegklasse(element);
                case "Motorveg" -> processMotorveg(element);
                case "Serviceveg" -> processServiceveg(element);
                case "Svingerestriksjon" -> processSvingerestriksjon(element);
                case "Trafikkreguleringer" -> processTrafikkreguleringer(element);
                case "Veglenke" -> processVeglenke(element);
                case "Vegsperring" -> processVegsperring(element);
                case "VærutsattVeg" -> processVærutsattVeg(element);
                default -> throw new IllegalArgumentException("Unknown element type " + element);
            }
        }
    }

    private static void processVærutsattVeg(Element element) {

    }

    private static void processTrafikkreguleringer(Element element) {

    }

    private static void processSvingerestriksjon(Element element) {

    }

    private static void processServiceveg(Element element) {

    }

    private static void processMotorveg(Element element) {

    }

    private static void processLandbruksvegklasse(Element element) {

    }

    private static void processJernbanekryssing(Element element) {

    }

    private static void processInnkjøringForbudt(Element element) {

    }

    private static void processHøydebegrensning(Element element) {

    }

    private static void processGågatereguleringer(Element element) {

    }

    private static void processFartsgrenseVariabel(Element element) {

    }

    private static void processBeredskapsveg(Element element) {
    }

    private static void processVegsperring(Element element) {

    }

    private static void processVeglenke(Element element) {

        var veglenke = new Elveg.Veglenke()
                .setDetaljnivå(textOrNull(element.find("detaljnivå")))
                .setTypeVeg(element.find("typeVeg").first().text())
                .setFeltoversikt(textOrNull(element.find("feltoversikt")))
                .setKonnekteringslenke("true".equals(element.find("konnekteringslenke").first().text()))
                .setSenterlinje(Gml.GmlLineString.fromXml(element.find("senterlinje", "*").single()));
        veglenke.getTypeVeg();
    }

    private static String textOrNull(ElementSet elementSet) {
        return elementSet.isPresent() ? elementSet.first().text() : null;
    }

    private static void processFunksjonellVegklasse(Element element) {

    }

    private static void processFartsgrense(Element element) {
        var fartsgrense = new Elveg.Fartsgrense()
                .setId(element.attr(GML.name("id")))
                .setFartsgrenseVerdi(textOrNull(element.find("fartgrenseVerdi")))
                .setSenterlinje(Gml.GmlLineString.fromXml(element.find("senterlinje", "*").single()));
    }


}
