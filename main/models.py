from django.db import models
from django.contrib.auth.models import User


class Artist(models.Model):
    name = models.CharField(max_length=50)
    photo = models.CharField(max_length=100)
    followers = models.IntegerField(blank=True, default=0)

    def __str__(self):
        return self.name

    def natural_key(self):
        return (self.name,)

    class Meta:
        db_table = "Artist"


class Album(models.Model):
    name = models.CharField(max_length=50)
    year = models.IntegerField()
    duration = models.TimeField()
    art = models.CharField(max_length=100)
    genre = models.CharField(max_length=20)
    artist = models.ForeignKey(Artist, on_delete=models.CASCADE)
    added = models.DateField(auto_now_add=True, blank=True, null=True)

    def __str__(self):
        return self.name

    def natural_key(self):
        return (self.pk, self.name, self.art, self.artist.name)

    class Meta:
        db_table = "Album"


class Song(models.Model):
    name = models.CharField(max_length=50)
    album = models.ForeignKey(Album, on_delete=models.CASCADE)
    secondary_artist = models.ForeignKey(
        Artist, on_delete=models.CASCADE, null=True, blank=True)
    duration = models.TimeField()
    path = models.CharField(max_length=300, null=True, blank=True)
    no_of_plays = models.IntegerField(blank=True, default=0)

    def __str__(self):
        return self.name

    def natural_key(self):
        return (self.name, self.album, self.path)

    class Meta:
        db_table = "Song"


class Favorite_Song(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    song = models.ForeignKey(
        Song, on_delete=models.CASCADE, null=True, blank=True)

    def __str__(self):
        return f"{self.user.first_name}'s Favorite_Song"

    class Meta:
        db_table = "Favorite_Song"


# class Playlist(models.Model):
#     user = models.ForeignKey(User, on_delete=models.CASCADE)
#     name = models.CharField(max_length=50)

#     def __str__(self):
#         return self.name

#     def natural_key(self):
#         return (self.pk, self.name)

#     class Meta:
#         db_table = "Playlist"


# class PlaylistSong(models.Model):
#     playlist = models.ForeignKey(Playlist, on_delete=models.CASCADE)
#     song = models.ForeignKey(Song, on_delete=models.CASCADE)

#     def __str__(self):
#         return self.name

#     class Meta:
#         db_table = "PlaylistSong"


class Favorite_Artist(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    artist = models.ForeignKey(Artist, on_delete=models.CASCADE)

    class Meta:
        db_table = "Favorite_Artist"


# class Favorite_Album(models.Model):
#     user = models.ForeignKey(User, on_delete=models.CASCADE)
#     album = models.ForeignKey(Album, on_delete=models.CASCADE)

#     class Meta:
#         db_table = "Favorite_Album"
