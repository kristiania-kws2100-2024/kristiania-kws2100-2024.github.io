create table veglenke
(
    kommunenummer varchar(4),
    id            varchar(30),
    type_veg      varchar(100),
    primary key (kommunenummer, id)
);
