# Generated by Django 3.2 on 2025-07-08 22:02

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('workouts', '0002_exercise_user'),
    ]

    operations = [
        migrations.RenameField(
            model_name='exercise',
            old_name='description',
            new_name='notes',
        ),
        migrations.RemoveField(
            model_name='exercise',
            name='max_reps',
        ),
        migrations.RemoveField(
            model_name='exercise',
            name='max_weight',
        ),
    ]
