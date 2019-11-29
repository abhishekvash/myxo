"""myxo URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/2.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from django.conf.urls import static
from django.conf import settings
from django.views.static import serve

from main.views import *

urlpatterns = [
    path('', home, name='home'),
    path('admin/', admin.site.urls),
    path('signin/', signin),
    path('signout/', signout),
    path('signup/', signup),
    path('api/user_auth/', user_auth),
    path('api/user_reg/', user_reg),
    path('oauth/', include('social_django.urls', namespace="social")),
    path('api/recently_added', recently_added),
    path('api/search', search),
    path('api/get_album/', get_album),
    path('api/get_artist/', get_artist),
    path('api/update_favorites/', update_favorites),
    path('api/update_favorite_artist/', update_favorite_artist),
    path('api/confirm_favorite/', confirm_favorite),
    path('api/confirm_favorite_artist/', confirm_favorite_artist),
    path('api/get_favorite_songs', get_favorite_songs),
    path('api/get_favorite_artists', get_favorite_artists),
    path('api/get_favorite_albums', get_favorite_albums),
    path('api/update_no_of_plays', update_no_of_plays),


    # For uploading from local db to remote db
    path('upload_artist/', upload_artists),
    path("upload_album/", upload_album),
    path("upload_songs/", upload_songs),
    path("upload_artists_from_local/", upload_artists_from_local),
    path("upload_album_from_local/", upload_album_from_local),
    path("upload_song_from_local/", upload_song_from_local),
]
