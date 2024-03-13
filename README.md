# Example queries

## What are the grunnkretser in Tromsø

```sql
select g.grunnkretsnavn, st_transform(g.omrade, 4326)::json
from kommuner_e1b95ab2fb054ee7998946cce6039771.kommune k,
grunnkretser_e01a5e1f76374c6cb1e71d4c940964ab.grunnkrets g
where kommunenavn = 'Tromsø'
and st_contains(k.omrade, g.omrade);
```

### What are close grunnkretser to an address (only in oslo) and how far away are they (in degrees)

```sql
select a.adressetekst, g.grunnkretsnavn,
st_distance(st_transform(a.representasjonspunkt, 4326), st_transform(g.omrade, 4326))
from matrikkelenadresse_9cf56fec95dd4f00a8a46cbf4b81a27c.vegadresse a
inner join grunnkretser_e01a5e1f76374c6cb1e71d4c940964ab.grunnkrets g on
(st_dwithin(g.omrade, a.representasjonspunkt, 500))
where adressenavn = 'Prinsens gate' and nummer = 7
order by st_distance(a.representasjonspunkt, g.omrade);
```

