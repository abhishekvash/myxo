# Generated by Django 2.2.6 on 2019-11-02 16:52

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0005_auto_20191029_1136'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='playlist',
            name='song',
        ),
        migrations.CreateModel(
            name='PlaylistSong',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('playlist', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='main.Playlist')),
                ('song', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='main.Song')),
            ],
            options={
                'db_table': 'PlaylistSong',
            },
        ),
    ]
