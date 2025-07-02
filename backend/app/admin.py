from django.contrib import admin
from .models import Exercise, Workout, Set

admin.site.register(Exercise)
admin.site.register(Workout)
admin.site.register(Set)