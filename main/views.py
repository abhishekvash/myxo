from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User

from main.models import *


def signin(request):
    return render(request, 'signin.html')


def signup(request):
    return render(request, 'signup.html')
