# Generated by Django 2.2.6 on 2019-11-26 07:32

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0012_remove_artist_followers'),
    ]

    operations = [
        migrations.AddField(
            model_name='artist',
            name='followers',
            field=models.IntegerField(blank=True, default=0),
        ),
    ]