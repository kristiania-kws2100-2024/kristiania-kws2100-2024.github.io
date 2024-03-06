package no.kristiania.kws2100.elveg;

import org.eaxy.Element;
import org.eaxy.ElementSet;
import org.eaxy.Namespace;
import org.eaxy.QualifiedName;
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
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.zip.ZipFile;

public class ImportElveg {

    private static final Namespace ELVEG_NS = new Namespace("http://skjema.geonorge.no/SOSI/produktspesifikasjon/Elveg/2.0");


    private Map<QualifiedName, ElementProcessor> elementProcessors = new HashMap<>();

    public ImportElveg(DataSource dataSource) {
        elementProcessors.put(ELVEG_NS.name("Fartsgrense"), element -> {});
        elementProcessors.put(ELVEG_NS.name("Beredskapsveg"), element -> {});
        elementProcessors.put(ELVEG_NS.name("Fartsgrense"), this::processFartsgrense);
        elementProcessors.put(ELVEG_NS.name("FartsgrenseVariabel"), element -> {});
        elementProcessors.put(ELVEG_NS.name("FunksjonellVegklasse"), element -> {});
        elementProcessors.put(ELVEG_NS.name("Gågatereguleringer"), element -> {});
        elementProcessors.put(ELVEG_NS.name("Høydebegrensning"), element -> {});
        elementProcessors.put(ELVEG_NS.name("InnkjøringForbudt"), element -> {});
        elementProcessors.put(ELVEG_NS.name("Jernbanekryssing"), element -> {});
        elementProcessors.put(ELVEG_NS.name("Landbruksvegklasse"), element -> {});
        elementProcessors.put(ELVEG_NS.name("Motorveg"), element -> {});
        elementProcessors.put(ELVEG_NS.name("Serviceveg"), element -> {});
        elementProcessors.put(ELVEG_NS.name("Svingerestriksjon"), element -> {});
        elementProcessors.put(ELVEG_NS.name("Trafikkreguleringer"), element -> {});
        elementProcessors.put(ELVEG_NS.name("Veglenke"), this::processVeglenke);
        elementProcessors.put(ELVEG_NS.name("Vegsperring"), element -> {});
        elementProcessors.put(ELVEG_NS.name("VærutsattVeg"), element -> {});
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
            this.elementProcessors.computeIfAbsent(element.getName(), name -> {
                throw new IllegalArgumentException("Missing processor for " + name);
            }).process(element);
        }
    }

    private void processVeglenke(Element element) {

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

    private void processFartsgrense(Element element) {
        var fartsgrense = new Elveg.Fartsgrense()
                .setId(element.attr(Gml.GML.name("id")))
                .setFartsgrenseVerdi(textOrNull(element.find("fartgrenseVerdi")))
                .setSenterlinje(Gml.GmlLineString.fromXml(element.find("senterlinje", "*").single()));
    }


}
