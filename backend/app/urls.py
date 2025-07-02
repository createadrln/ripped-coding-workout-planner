from django.urls import path
from django.shortcuts import render
from . import views

urlpatterns = [
    path('login/', views.user_login, name='login'),
    path('register/', views.register, name='register'),
    path('create-exercise/', views.create_exercise, name='create_exercise'),
    path('exercise-success/', lambda request: render(request,
         'exercise_success.html'), name='exercise_success'),
    path('create-workout-template/', views.create_workout_template,
         name='create_workout_template'),
    path('workout-template-success/', lambda request: render(request,
         'workout_template_success.html'), name='workout_template_success'),
    path('my-workout-templates/', views.user_workout_templates,
         name='user_workout_templates'),
    path('edit-workout-template/<int:template_id>/',
         views.edit_workout_template, name='edit_workout_template'),
]
