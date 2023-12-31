# Generated by Django 4.2.4 on 2023-11-29 18:09

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models

import main.models


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('main', '0011_vector'),
    ]

    operations = [
        # migrations.AlterField(
        #     model_name='vector',
        #     name='file',
        #     field=models.FileField(upload_to=main.models.upload_to),
        # ),
        migrations.AlterField(
            model_name='vector',
            name='user',
            field=models.ForeignKey(
                default=1,
                on_delete=django.db.models.deletion.CASCADE,
                to=settings.AUTH_USER_MODEL,
            ),
            preserve_default=False,
        ),
    ]
