# Generated by Django 4.2.4 on 2023-10-23 13:50

from django.db import migrations, models

import main.models


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0003_alter_geojsonfile_geojson'),
    ]

    operations = [
        migrations.CreateModel(
            name='RasterFile',
            fields=[
                (
                    'id',
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name='ID',
                    ),
                ),
                ('name', models.CharField(max_length=100)),
                (
                    'raster',
                    models.FileField(
                        upload_to='rasters/',
                        validators=[main.models.validate_file_extension],
                    ),
                ),
            ],
        ),
    ]
