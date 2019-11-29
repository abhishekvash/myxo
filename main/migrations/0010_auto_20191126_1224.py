# Generated by Django 2.2.6 on 2019-11-26 06:54

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('main', '0009_auto_20191105_1857'),
    ]

    operations = [
        migrations.RenameModel(
            old_name='Favorite',
            new_name='Favorite_Song',
        ),
        migrations.AddField(
            model_name='artist',
            name='followers',
            field=models.IntegerField(blank=True, null=True),
        ),
        migrations.AlterModelTable(
            name='favorite_song',
            table='Favorite_Song',
        ),
        migrations.CreateModel(
            name='Favorite_Artist',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('artist', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='main.Artist')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'db_table': 'Favorite_Artist',
            },
        ),
        migrations.CreateModel(
            name='Favorite_Album',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('album', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='main.Album')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'db_table': 'Favorite_Album',
            },
        ),
    ]