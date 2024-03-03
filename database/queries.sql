select
    st_asgeojson(representasjonspunkt),
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


select st_distance(a.representasjonspunkt, b.representasjonspunkt, true) avstand, *
from vegadresse a, vegadresse b
where
    b.adressenavn = 'Urtegata' and b.nummer = 9
  and
    st_dwithin(a.representasjonspunkt, b.representasjonspunkt, 100.0, true)
order by avstand;

select
    a.adressetekst,
    g.grunnkretsnavn,
    a.representasjonspunkt,
    g.omrade,
    st_asgeojson(a.representasjonspunkt),
    st_asgeojson(g.omrade)
from vegadresse a, vegadresse b, grunnkrets g
where
    a.adressenavn = 'Kongens gate' and a.nummer = 22
  and
    st_dwithin(a.representasjonspunkt, b.representasjonspunkt, 100.0, true)
  and  st_contains(g.omrade, a.representasjonspunkt)
;


