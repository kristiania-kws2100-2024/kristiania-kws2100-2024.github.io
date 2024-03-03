create table public.kommune as
select kommunenummer, kommunenavn, st_transform(omrade, 4326) omrade
from kommuner_3e4eabd3bcdc490cb3f65d3c452e311d.kommune;
alter table public.kommune add primary key (kommunenummer);
create index kommune_omrade on kommune using gist (omrade);

create table public.grunnkrets
as
select grunnkretsnummer, grunnkretsnavn, st_transform(omrade, 4326) omrade
from grunnkretser_4099bc08fc834aaeb774454f063d0198.grunnkrets;
alter table public.grunnkrets add primary key (grunnkretsnummer);
create index grunnkrets_omrade on grunnkrets using gist (omrade);

create table public.vegadresse
as
select adresseid, adressetekst,
       st_transform(representasjonspunkt, 4326) representasjonspunkt,
       adressenavn, nummer, bokstav, postnummer, poststed,
       matrikkelnummeradresse_gardsnummer, matrikkelnummeradresse_bruksnummer, matrikkelnummeradresse_festenummer, matrikkelnummeradresse_seksjonsnummer
from matrikkelenadresse_d66f592222314232a14f00abbeb047dc.vegadresse;

alter table public.vegadresse add primary key (adresseid);
create index vegadresse_representasjonspunkt on vegadresse using gist (representasjonspunkt);

