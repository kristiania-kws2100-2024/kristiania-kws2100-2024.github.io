create table fartsgrense
(
    kommunenummer    varchar(4),
    id               varchar(30),
    lokal_id         varchar(30)                 not null,
    verdi            varchar(100)                not null,
    senterlinje      geometry(LineStringZ, 5973) not null,
    pos_lenkesekvens varchar(30)                 not null,
    pos_retning      varchar(10)                 not null,
    pos_fra          numeric                     not null,
    pos_til          numeric                     not null,
    primary key (kommunenummer, id)
);

create index fartsgrense_senterlinje on fartsgrense using gist (senterlinje);
