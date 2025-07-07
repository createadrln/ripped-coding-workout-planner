from django.db import models
import uuid


class Exercise(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    muscle_group = models.CharField(max_length=100, blank=True)
    max_weight = models.DecimalField(
        max_digits=6, decimal_places=2, null=True, blank=True)
    max_reps = models.PositiveIntegerField(null=True, blank=True)

    def __str__(self):
        return self.name


class Workout(models.Model):
    workout_id = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    date = models.DateField()
    notes = models.TextField(blank=True)
    templates = models.ManyToManyField('WorkoutTemplate', blank=True)
    user = models.ForeignKey('auth.User', on_delete=models.CASCADE, default=1)

    def __str__(self):
        return f"Workout on {self.date}"


class Set(models.Model):
    workout = models.ForeignKey(
        Workout, related_name='sets', on_delete=models.CASCADE)
    exercise = models.ForeignKey(
        Exercise, related_name='sets', on_delete=models.CASCADE)
    weight = models.DecimalField(max_digits=6, decimal_places=2)
    reps = models.PositiveIntegerField()
    set_number = models.PositiveIntegerField()

    def __str__(self):
        return f"{self.exercise.name} - {self.weight} x {self.reps} (Set {self.set_number})"


class WorkoutTemplate(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    exercises = models.ManyToManyField(Exercise, blank=True)
    user = models.ForeignKey('auth.User', on_delete=models.CASCADE, default=1)

    def __str__(self):
        return self.name
