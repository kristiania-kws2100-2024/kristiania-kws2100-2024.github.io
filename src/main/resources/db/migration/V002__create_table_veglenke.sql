create table veglenke
(
    kommunenummer varchar(4),
    id            varchar(30),
    type_veg      varchar(100),
    senterlinje   geometry(LineStringZ, 5973) not null,
    primary key (kommunenummer, id)
);

create index veglenke_senterlinje on veglenke using gist(senterlinje);
