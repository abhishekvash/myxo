from django.contrib import admin
from main.models import *

admin.site.register(Artist)
admin.site.register(Album)
admin.site.register(Song)
admin.site.register(Favorite_Song)
admin.site.register(Favorite_Artist)
