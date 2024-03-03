select
    st_asgeojson(representasjonspunkt),
    st_asgeojson(st_transform(representasjonspunkt, 4326)),
    *
from vegadresse
where adressenavn = 'Kongens gate' and nummer = 22;

select *
from vegadresse
where adressenavn = 'Urtegata' and nummer = 9;


select a.adressetekst,
       b.adressetekst,
       st_distance(a.representasjonspunkt, b.representasjonspunkt)
from vegadresse a, vegadresse b
where
    a.adressenavn = 'Kongens gate' and a.nummer = 22
  and
    b.adressenavn = 'Urtegata' and b.nummer = 9;


select st_distance(a.representasjonspunkt, b.representasjonspunkt) avstand, *
from vegadresse a, vegadresse b
where
    b.adressenavn = 'Urtegata' and b.nummer = 9
  and
    st_distance(a.representasjonspunkt, b.representasjonspunkt) < 100
order by avstand;

select
    a.adressetekst,
    k.kommunenavn,
    a.representasjonspunkt,
    k.omrade,
    st_asgeojson(st_transform(a.representasjonspunkt, 4326)),
    st_asgeojson(st_transform(k.omrade, 4326))
from vegadresse a, vegadresse b, kommune k
where
    b.adressenavn = 'Urtegata' and b.nummer = 9
  and
    st_distance(a.representasjonspunkt, b.representasjonspunkt) < 100
  and  st_contains(st_transform(k.omrade, 4326), st_transform(a.representasjonspunkt, 4326))
;


