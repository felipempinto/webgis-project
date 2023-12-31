# Generated by Django 4.2.4 on 2023-11-16 18:22

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('main', '0008_geoserverdata_project'),
    ]

    operations = [
        migrations.AddField(
            model_name='geojsonfile',
            name='user',
            field=models.ForeignKey(
                blank=True,
                null=True,
                on_delete=django.db.models.deletion.CASCADE,
                to=settings.AUTH_USER_MODEL,
            ),
        ),
        migrations.AlterField(
            model_name='project',
            name='raster',
            field=models.ManyToManyField(blank=True, to='main.rasterfile'),
        ),
        migrations.AlterField(
            model_name='project',
            name='vector',
            field=models.ManyToManyField(blank=True, to='main.geojsonfile'),
        ),
    ]
