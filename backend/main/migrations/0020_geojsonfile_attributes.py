# Generated by Django 4.1.13 on 2024-01-18 18:01

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0019_spatialdatat_file_name_alter_rasterfile_raster'),
    ]

    operations = [
        migrations.AddField(
            model_name='geojsonfile',
            name='attributes',
            field=models.JSONField(blank=True, null=True),
        ),
    ]
