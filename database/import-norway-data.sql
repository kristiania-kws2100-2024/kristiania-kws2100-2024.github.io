create table kommuner
as
    select kommunenummer, kommunenavn, omrade from kommuner_3e4eabd3bcdc490cb3f65d3c452e311d.kommune;
alter table kommuner add primary key (kommunenummer);
create index kommune_omrade on kommuner using gist (omrade);

