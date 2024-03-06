create table fartsgrense
(
    kommunenummer varchar(4),
    id            varchar(30),
    verdi         varchar(100),
    senterlinje   geometry(LineStringZ, 5973) not null,
    primary key (kommunenummer, id)
);

create index fartsgrense_senterlinje on fartsgrense using gist (senterlinje);
