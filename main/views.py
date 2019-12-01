from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.http import JsonResponse, HttpResponse
from django.contrib.auth.decorators import login_required
from django.core import serializers as serial
from django.db import connection
import json
import requests
from main.models import *
cursor = connection.cursor()


def signin(request):
    return render(request, 'signin.html')


def signup(request):
    return render(request, 'signup.html')


def user_auth(request):
    username = request.POST['username']
    password = request.POST['password']
    user_present = True
    password_correct = True
    try:
        get_user = User.objects.get(username=username)
        user_present = True
        user = authenticate(username=username, password=password)
        if user is not None:
            login(request, user)
            response = {"validated": True,
                        "user_present": True,
                        "password_correct": True}
            return JsonResponse(response)
        else:
            password_correct = False
    except Exception:
        user_present = False
    response = {"validated": False,
                "user_present": user_present,
                "password_correct": password_correct}
    return JsonResponse(response)


@login_required(login_url='/signin/')
def home(request):
    return render(request, 'home.html')


@login_required(login_url='/signin/')
def signout(request):
    logout(request)
    return redirect('/signin/')


def user_reg(request):
    username = request.POST['username']
    password = request.POST['password']
    email = request.POST['email']
    registered = False
    user_present = True
    try:
        user = User.objects.get(username=username)
    except Exception:
        user_present = False
        if password:
            user = User.objects.create_user(
                username=username, email=email, password=password)
            registered = True

    response = {"registered": registered,
                "user_present": user_present}
    return JsonResponse(response)


def recently_added(request):
    albums = Album.objects.raw(
        ''' SELECT * FROM "Album" ORDER BY added DESC LIMIT 10; ''')
    response = serial.serialize('json', albums, use_natural_foreign_keys=True)
    return HttpResponse(response, content_type='application/json')


def update_no_of_plays(request):
    path = request.GET['path']
    success = False
    try:
        cursor.execute(
            ''' UPDATE "Song" SET no_of_plays = no_of_plays+1 WHERE path=%s ; ''', [path])
        success = True
    except Exception:
        success = False
    response = {'success': success}
    response = json.dumps(response)
    return HttpResponse(response, content_type='application/json')


def search(request):
    phrase = request.POST['phrase']
    albums = Album.objects.raw('''
        SELECT * FROM "Album" WHERE name ~* %s;
    ''', [phrase])
    songs = Song.objects.raw('''
        SELECT * FROM "Song" WHERE name ~* %s;
    ''', [phrase])
    artists = Artist.objects.raw('''
        SELECT * FROM "Artist" WHERE name ~* %s;
    ''', [phrase])
    response1 = serial.serialize('json', albums, use_natural_foreign_keys=True)
    response2 = serial.serialize('json', songs, use_natural_foreign_keys=True)
    response3 = serial.serialize(
        'json', artists, use_natural_foreign_keys=True)
    response = {"albums": response1, "songs": response2, "artists": response3}
    response = json.dumps(response)
    return HttpResponse(response, content_type='application/json')


def get_album(request):
    album_id = request.GET['album_id']
    album = Album.objects.raw('''
    SELECT * FROM "Album" WHERE id = %s ''', [album_id])
    songs = Song.objects.raw('''
    SELECT * FROM "Song" WHERE album_id = %s''', [album_id])
    response1 = serial.serialize('json', album, use_natural_foreign_keys=True)
    response2 = serial.serialize('json', songs, use_natural_foreign_keys=True)
    response = {"album": response1, "songs": response2, }
    response = json.dumps(response)
    return HttpResponse(response, content_type='application/json')


def get_artist(request):
    artist_id = int(request.GET['artist_id'])
    artist = Artist.objects.raw('''
    SELECT * FROM "Artist" WHERE id = %s ''', [artist_id])
    album = Album.objects.raw('''
    SELECT * FROM "Album" WHERE artist_id = %s  ''', [artist_id])
    song = Song.objects.raw('''
    SELECT * FROM "Song" WHERE album_id in (SELECT id FROM "Album" WHERE artist_id = %s) ORDER BY no_of_plays DESC LIMIT 10 ;''', [artist_id])
    response1 = serial.serialize('json', artist, use_natural_foreign_keys=True)
    response2 = serial.serialize('json', song, use_natural_foreign_keys=True)
    response3 = serial.serialize('json', album, use_natural_foreign_keys=True)
    response = {"artist": response1, "songs": response2, "albums": response3}
    response = json.dumps(response)
    return HttpResponse(response, content_type='application/json')


def update_favorites(request):
    no_fav = False
    add_to_favorites = False
    try:
        add_to_favorites = request.POST['add_to_fav']
    except Exception:
        no_fav = True
    user_id = int(request.user.pk)
    song_pk = int(request.POST['song_pk'])
    favorite = Favorite_Song.objects.raw(
        ''' SELECT * FROM "Favorite_Song" WHERE song_id = %s AND user_id = %s ; ''', [song_pk, user_id])
    if len(favorite) == 0 and add_to_favorites == 'on':
        cursor.execute(''' INSERT INTO "Favorite_Song"(user_id, song_id) VALUES(%s, %s); ''', [
            user_id, song_pk])
    if len(favorite) > 0 and no_fav is True:
        cursor.execute(''' DELETE FROM "Favorite_Song" WHERE user_id = %s AND song_id = %s ; ''', [
            user_id, song_pk])
    return HttpResponse('ok')


def confirm_favorite(request):
    is_favorite = False
    user_id = int(request.user.pk)
    song_pk = int(request.GET['song_pk'])
    favorite = Favorite_Song.objects.raw(
        ''' SELECT * FROM "Favorite_Song" WHERE song_id = %s AND user_id = %s ; ''', [song_pk, user_id])
    if len(favorite) == 0:
        is_favorite = False
    else:
        is_favorite = True
    response = {"is_favorite": is_favorite}
    return JsonResponse(response)


def confirm_favorite_artist(request):
    is_favorite = False
    user_id = int(request.user.pk)
    artist_id = int(request.GET['artist_id'])
    favorite = Favorite_Artist.objects.raw(
        ''' SELECT * FROM "Favorite_Artist" WHERE artist_id = %s AND user_id = %s ; ''', [artist_id, user_id])
    if len(favorite) == 0:
        print(len(favorite))
        is_favorite = False
    else:
        print(len(favorite))
        is_favorite = True
    response = {"is_favorite": is_favorite}
    return JsonResponse(response)


def update_favorite_artist(request):
    is_favorite = False
    user_id = int(request.user.pk)
    artist_id = int(request.GET['artist_id'])
    favorite = Favorite_Artist.objects.raw(
        ''' SELECT * FROM "Favorite_Artist" WHERE artist_id = %s AND user_id = %s ; ''', [artist_id, user_id])
    if len(favorite) == 0:
        cursor.execute(''' INSERT INTO "Favorite_Artist"(user_id, artist_id) VALUES(%s,%s) ''', [
                       user_id, artist_id])
    else:
        cursor.execute(''' DELETE FROM "Favorite_Artist" WHERE user_id= %s AND artist_id = %s ''', [
                       user_id, artist_id])
    artist = Artist.objects.raw(
        ''' SELECT * FROM "Artist" WHERE id = %s ''', [artist_id])
    response = {'followers': artist[0].followers}
    response = json.dumps(response)
    return HttpResponse(response, content_type='application/json')


def get_favorite_songs(request):
    user_id = int(request.user.pk)
    favorite_songs = Song.objects.raw(
        ''' SELECT * FROM "Song" WHERE id in (SELECT song_id FROM "Favorite_Song" WHERE user_id = %s) ''', [user_id])
    response = serial.serialize(
        'json', favorite_songs, use_natural_foreign_keys=True)
    return HttpResponse(response, content_type='application/json')


def get_top_hits(request):
    user_id = int(request.user.pk)
    favorite_songs = Song.objects.raw(
        ''' SELECT * FROM "Song" ORDER BY no_of_plays DESC LIMIT 10''')
    response = serial.serialize(
        'json', favorite_songs, use_natural_foreign_keys=True)
    return HttpResponse(response, content_type='application/json')


def get_favorite_artists(request):
    user_id = int(request.user.pk)
    favorite_albums = Artist.objects.raw(
        ''' SELECT * FROM "Artist" WHERE id in (SELECT artist_id FROM "Favorite_Artist" WHERE user_id = %s) ''', [user_id])
    response = serial.serialize(
        'json', favorite_albums, use_natural_foreign_keys=True)
    return HttpResponse(response, content_type='application/json')


# For uploading from local db to remote db
def upload_artists(request):
    if request.method == "GET":
        name = request.GET.get("name")
        photo = request.GET.get("photo")
        print(name)
        print(photo)
        artist = Artist.objects.create(name=name, photo=photo)
        return HttpResponse("DONE")


def upload_album(request):
    if request.method == "GET":
        name = request.GET.get("name")
        year = request.GET.get("year")
        duration = request.GET.get("duration")
        art = request.GET.get("art")
        genre = request.GET.get("genre")
        artist = request.GET.get("artist")
        artist = Artist.objects.get(pk=int(artist))
        album = Album.objects.create(name=name,
                                     year=year,
                                     duration=duration,
                                     art=art,
                                     genre=genre,
                                     artist=artist)
        return HttpResponse("done")


def upload_songs(request):
    if request.method == "GET":
        name = request.GET.get("name")
        album = int(request.GET.get("album"))
        duration = request.GET.get("duration")
        path = request.GET.get("path")
        no_of_plays = request.GET.get("no_of_plays")
        album = Album.objects.get(pk=album)
        song = Song.objects.create(name=name,
                                   album=album,
                                   duration=duration,
                                   path=path,
                                   no_of_plays=no_of_plays)
        return HttpResponse("done")


def upload_artists_from_local(request):
    artists = Artist.objects.all()
    json_data = {}
    for artist in artists:
        json_data["name"] = artist.name
        json_data["photo"] = artist.photo
        response = requests.get(
            "https://myxo.herokuapp.com/upload_artist/", json_data)
    return HttpResponse("done")


def upload_album_from_local(request):
    albums = Album.objects.all()
    json_data = {}
    for album in albums:
        json_data["name"] = album.name
        json_data["year"] = album.year
        json_data["duration"] = album.duration
        json_data["art"] = album.art
        json_data["genre"] = album.genre
        json_data["artist"] = album.artist.pk
        response = requests.get(
            "https://myxo.herokuapp.com/upload_album/", json_data)
    return HttpResponse("done")


def upload_song_from_local(request):
    songs = Song.objects.all()
    json_data = {}
    for song in songs:
        json_data["name"] = song.name
        json_data["album"] = song.album.pk
        json_data["secondary_artist"] = song.secondary_artist
        json_data["duration"] = song.duration
        json_data["path"] = song.path
        json_data["no_of_play"] = song.no_of_plays
        response = requests.get(
            "https://myxo.herokuapp.com/upload_songs/", json_data)
        print(response)
    return HttpResponse("done")
