# Generated by Django 4.2.4 on 2023-11-30 17:37

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0013_project_geojson_alter_project_vector'),
    ]

    operations = [
        migrations.AddField(
            model_name='project',
            name='public',
            field=models.BooleanField(default=False),
        ),
    ]
