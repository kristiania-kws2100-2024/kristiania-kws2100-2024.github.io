create table funksjonell_vegklasse
(
    kommunenummer    varchar(4),
    id               varchar(50),
    lokal_id         varchar(30)                 not null,
    vegklasse        int                         not null,
    senterlinje      geometry(LineStringZ, 5973) not null,
    pos_lenkesekvens varchar(30)                 not null,
    pos_retning      varchar(10)                 not null,
    pos_fra          numeric                     not null,
    pos_til          numeric                     not null,
    primary key (kommunenummer, id)
);

create index funksjonell_vegklasse_senterlinje on funksjonell_vegklasse using gist (senterlinje);
