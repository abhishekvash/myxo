CREATE TRIGGER unfollow
    BEFORE DELETE
    ON public."Favorite_Artist"
    FOR EACH ROW
    EXECUTE PROCEDURE public.remove_follower();