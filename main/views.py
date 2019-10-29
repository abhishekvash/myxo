from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.http import JsonResponse
from django.contrib.auth.decorators import login_required

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
            print(registered)
    print(registered)
    response = {"registered": registered,
                "user_present": user_present}
    return JsonResponse(response)
