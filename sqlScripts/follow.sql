CREATE TRIGGER follow
    AFTER INSERT
    ON public."Favorite_Artist"
    FOR EACH ROW
    EXECUTE PROCEDURE public.add_follower();