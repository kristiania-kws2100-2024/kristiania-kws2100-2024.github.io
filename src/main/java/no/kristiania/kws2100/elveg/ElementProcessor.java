package no.kristiania.kws2100.elveg;

import org.eaxy.Element;

import java.sql.SQLException;

public interface ElementProcessor extends AutoCloseable {
    void process(Element element) throws SQLException;

    @Override
    default void close() throws SQLException {}
}
