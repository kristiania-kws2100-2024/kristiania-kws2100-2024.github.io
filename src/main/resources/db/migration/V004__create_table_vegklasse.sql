create table funksjonell_vegklasse
(
    kommunenummer varchar(4),
    id            varchar(50),
    lokal_id      varchar(30)                 not null,
    vegklasse     int,
    senterlinje   geometry(LineStringZ, 5973) not null,
    primary key (kommunenummer, id)
);

create index funksjonell_vegklasse_senterlinje on funksjonell_vegklasse using gist (senterlinje);
