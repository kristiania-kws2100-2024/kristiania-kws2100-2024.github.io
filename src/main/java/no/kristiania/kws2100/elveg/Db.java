package no.kristiania.kws2100.elveg;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.function.Function;

public class Db {

    public static <T> TableMapper<T> tableMapper(String tableName, ColumnMapper<T> mapper) {
        return new TableMapper<T>(tableName, mapper);
    }

    public static class TableMapper<T> {
        private final String tableName;
        private final ColumnMapper<T> mapper;

        public TableMapper(String tableName, ColumnMapper<T> mapper) {
            this.tableName = tableName;
            this.mapper = mapper;
        }

        public PreparedStatement prepareStatement(Connection connection) throws SQLException {
            //noinspection SqlSourceToSinkFlow
            return connection.prepareStatement(getInsertSql());
        }

        private String getInsertSql() {
            return "insert into " + tableName +
                   " (" + String.join(", ", mapper.getColumnNames()) + ")" +
                   " values " +
                   " (" + String.join(", ", mapper.getColumnExpressions()) + ")";
        }

        public void setParameters(PreparedStatement statement, T object) throws SQLException {
            var columnGetters = mapper.getColumnGetters();
            for (int i = 0; i < columnGetters.size(); i++) {
                var columnGetter = columnGetters.get(i);
                statement.setObject(i+1, columnGetter.apply(object));
            }
        }
    }

    public static <T> ColumnMapper<T> columnMapper(Class<T> type) {
        return new ColumnMapper<>();
    }

    public static class ColumnMapper<T> {
        private LinkedHashMap<String, Function<T, Object>> primaryKeys = new LinkedHashMap<>();
        private LinkedHashMap<String, String> primaryKeyExpressions = new LinkedHashMap<>();
        private LinkedHashMap<String, Function<T, Object>> columns = new LinkedHashMap<>();
        private LinkedHashMap<String, String> columnExpressions = new LinkedHashMap<>();

        public ColumnMapper<T> primaryKey(String columnName, Function<T, Object> getter) {
            primaryKeys.put(columnName, getter);
            primaryKeyExpressions.put(columnName, "?");
            return this;
        }

        public ColumnMapper<T> column(String columnName, Function<T, Object> getter) {
            return column(columnName, "?", getter);
        }

        public ColumnMapper<T> column(String columnName, String expression, Function<T, Object> getter) {
            columns.put(columnName, getter);
            columnExpressions.put(columnName, expression);
            return this;
        }

        public List<String> getColumnNames() {
            var result = new ArrayList<>(primaryKeys.keySet());
            result.addAll(columns.keySet());
            return result;
        }

        public List<String> getColumnExpressions() {
            var result = new ArrayList<>(primaryKeyExpressions.values());
            result.addAll(columnExpressions.values());
            return result;
        }

        public List<Function<T, Object>> getColumnGetters() {
            var result = new ArrayList<>(primaryKeys.values());
            result.addAll(columns.values());
            return result;
        }

        public <U> ColumnMapper<T> columns(String prefix, Function<T, U> getter, ColumnMapper<U> columnMapper) {
            for (var column : columnMapper.columns.entrySet()) {
                columns.put(prefix + column.getKey(), o -> {
                    var nested = getter.apply(o);
                    return nested != null ? column.getValue().apply(nested) : null;
                });
                columnExpressions.put(prefix + column.getKey(), columnMapper.columnExpressions.get(column.getKey()));
            }
            return this;
        }
    }
}
