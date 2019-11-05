from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.http import JsonResponse, HttpResponse
from django.contrib.auth.decorators import login_required
from django.core import serializers as serial
import json
import requests

from main.models import *


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

def upload_artists(request):
    if request.method == "POST":
        name = request.POST.get("name")
        photo = request.POST.get("photo")

        artist = Artist.objects.create(name=name, photo=photo)

        return HttpResponse("DONE")
