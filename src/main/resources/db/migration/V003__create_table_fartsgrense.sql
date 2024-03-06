create table fartsgrense
(
    id    varchar(30) primary key,
    verdi varchar(100),
    senterlinje   geometry(LineStringZ, 5973) not null
);

create index fartsgrense_senterlinje on fartsgrense using gist(senterlinje);
