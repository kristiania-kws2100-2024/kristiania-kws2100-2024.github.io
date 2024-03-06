create table kommuner
as
select kommunenummer, kommunenavn, st_transform(omrade, 4326) as omrade
from kommuner_3e4eabd3bcdc490cb3f65d3c452e311d.kommune;
alter table kommuner
    add primary key (kommunenummer);
create index kommune_omrade on kommuner using gist (omrade);

create table adresser
as
select adresseid,
       adressetekst,
       adressenavn,
       nummer,
       bokstav,
       st_transform(representasjonspunkt, 4326) as representasjonspunkt
from matrikkelenadresse_d66f592222314232a14f00abbeb047dc.vegadresse;
alter table adresser
    add primary key (adresseid);
create index adresse_representasjonspunkt on adresser using gist (representasjonspunkt);

create table grunnkretser
as
select grunnkretsnummer, grunnkretsnavn, st_transform(omrade, 4326) as omrade
from grunnkretser_4099bc08fc834aaeb774454f063d0198.grunnkrets;
alter table grunnkretser
    add primary key (grunnkretsnummer);
create index grunkrets_omrade on grunnkretser using gist (omrade);
