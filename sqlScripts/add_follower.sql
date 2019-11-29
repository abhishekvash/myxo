CREATE FUNCTION public.add_follower()
    RETURNS trigger
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE NOT LEAKPROOF
AS $BODY$
BEGIN
update public."Artist" set followers = followers+1 where id = NEW.artist_id;
return new;
end;
$BODY$;