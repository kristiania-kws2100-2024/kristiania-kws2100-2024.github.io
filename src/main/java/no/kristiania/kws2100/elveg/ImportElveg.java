package no.kristiania.kws2100.elveg;

import org.eaxy.QualifiedName;
import org.eaxy.Xml;
import org.flywaydb.core.Flyway;
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
import java.util.TreeMap;
import java.util.zip.ZipFile;

public class ImportElveg implements AutoCloseable {

    private final Map<QualifiedName, ElementProcessor> elementProcessors = new HashMap<>();
    private final Map<String, Integer> elementCount = new TreeMap<>();

    public ImportElveg(DataSource dataSource, String kommunenummer) throws SQLException {
        var connection = dataSource.getConnection();
        elementProcessors.put(Elveg.NS.name("Fartsgrense"), element -> {});
        elementProcessors.put(Elveg.NS.name("Beredskapsveg"), element -> {});
        elementProcessors.put(Elveg.NS.name("Fartsgrense"), new ElvegProcessors.FartsgrenseProcessor(connection, kommunenummer));
        elementProcessors.put(Elveg.NS.name("FartsgrenseVariabel"), element -> {});
        elementProcessors.put(Elveg.NS.name("FunksjonellVegklasse"), new ElvegProcessors.FunksjonellVegklasseProcessor(connection, kommunenummer));
        elementProcessors.put(Elveg.NS.name("Gågatereguleringer"), element -> {});
        elementProcessors.put(Elveg.NS.name("Høydebegrensning"), element -> {});
        elementProcessors.put(Elveg.NS.name("InnkjøringForbudt"), element -> {});
        elementProcessors.put(Elveg.NS.name("Jernbanekryssing"), element -> {});
        elementProcessors.put(Elveg.NS.name("Landbruksvegklasse"), element -> {});
        elementProcessors.put(Elveg.NS.name("Motorveg"), element -> {});
        elementProcessors.put(Elveg.NS.name("Serviceveg"), element -> {});
        elementProcessors.put(Elveg.NS.name("Svingerestriksjon"), element -> {});
        elementProcessors.put(Elveg.NS.name("Trafikkreguleringer"), element -> {});
        elementProcessors.put(Elveg.NS.name("Veglenke"), new ElvegProcessors.VeglenkeProcessor(connection));
        elementProcessors.put(Elveg.NS.name("Vegsperring"), element -> {});
        elementProcessors.put(Elveg.NS.name("VærutsattVeg"), element -> {});
    }

    @Override
    public void close() throws SQLException {
        for (var value : elementProcessors.values()) {
            value.close();
        }
        System.out.println("element counts " + elementCount);
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
        var flyway = Flyway.configure().dataSource(dataSource).cleanDisabled(false).load();
        flyway.clean();
        flyway.migrate();

        try (var zipFile = new ZipFile(path.toFile())) {
            for (var zipEntry : Collections.list(zipFile.entries())) {
                if (zipEntry.getSize() < 10_000_000) {
                    System.out.println("Processing " + zipEntry);
                    try (var inputStream = zipFile.getInputStream(zipEntry)) {
                        var kommunenummer = zipEntry.toString().substring(0, 4);
                        try (var importElveg = new ImportElveg(dataSource, kommunenummer)) {
                            importElveg.processElvegFile(inputStream);
                        }
                    }
                } else {
                    System.out.println("Skipping " + zipEntry);
                }
            }
        }
    }

    private void processElvegFile(InputStream inputStream) throws SQLException {
        var filter = Xml.filter("member", "*");
        for (var element : filter.iterate(new InputStreamReader(inputStream))) {
            var tagName = element.getName();
            elementCount.put(tagName.getName(), elementCount.getOrDefault(tagName.getName(), 0) + 1);
            this.elementProcessors.computeIfAbsent(tagName, name -> {
                throw new IllegalArgumentException("Missing processor for " + name);
            }).process(element);
        }
    }

}
