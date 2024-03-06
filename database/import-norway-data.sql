create table kommuner
as
    select kommunenummer, kommunenavn, omrade from kommuner_3e4eabd3bcdc490cb3f65d3c452e311d.kommune;
alter table kommuner add primary key (kommunenummer);
create index kommune_omrade on kommuner using gist (omrade);

create table adresser
as
    select adresseid, adressetekst,
           adressenavn, nummer, bokstav,
           representasjonspunkt
    from matrikkelenadresse_d66f592222314232a14f00abbeb047dc.vegadresse;
alter table adresser add primary key (adresseid);
create index adresse_representasjonspunkt on adresser using gist(representasjonspunkt);
