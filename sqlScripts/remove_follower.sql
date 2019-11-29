CREATE FUNCTION public.remove_follower()
    RETURNS trigger
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE NOT LEAKPROOF
AS $BODY$
BEGIN
update public."Artist" set followers = followers-1 where id = OLD.artist_id;
return OLD;
end;
$BODY$;