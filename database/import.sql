create table kommuner
as
select kommunenummer, kommunenavn, omrade
from kommuner_e1b95ab2fb054ee7998946cce6039771.kommune;

alter table kommuner add primary key (kommunenummer);
create index kommune_omrade on kommuner using gist(omrade);
