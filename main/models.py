from django.db import models
from django.contrib.auth.models import User


class Artist(models.Model):
    name = models.CharField(max_length=50)
    photo = models.CharField(max_length=100)

    def __str__(self):
        return self.name

    class Meta:
        db_table = "Artist"


class Album(models.Model):
    name = models.CharField(max_length=50)
    year = models.IntegerField()
    art = models.CharField(max_length=100)
    genre = models.CharField(max_length=20)
    duration = models.TimeField()
    artist = models.ForeignKey(Artist, on_delete=models.CASCADE)

    def __str__(self):
        return self.name

    class Meta:
        db_table = "Album"


class Song(models.Model):
    name = models.CharField(max_length=50)
    album = models.ForeignKey(Album, on_delete=models.CASCADE)
    secondary_artist = models.ForeignKey(
        Artist, on_delete=models.CASCADE, null=True, blank=True)
    duration = models.TimeField()
    path = models.CharField(max_length=100, null=True, blank=True)
    no_of_plays = models.IntegerField(null=True, blank=True)
    added_on = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

    class Meta:
        db_table = "Song"


class Favorite(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    song = models.ForeignKey(
        Song, on_delete=models.CASCADE, null=True, blank=True)

    def __str__(self):
        return f"{self.user.first_name}'s Favorites"

    class Meta:
        db_table = "Favorites"


class Playlist(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    name = models.CharField(max_length=50)
    song = models.ForeignKey(
        Song, on_delete=models.CASCADE, null=True, blank=True)

    def __str__(self):
        return self.name

    class Meta:
        db_table = "Playlist"
