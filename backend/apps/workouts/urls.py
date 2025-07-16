from django.urls import path, include
from django.shortcuts import render
from apps.workouts import views

urlpatterns = [
    path('', views.home, name='home'),
    path('create-exercise/', views.create_exercise, name='create_exercise'),
    path('my-exercises/', views.user_exercises, name='user_exercises'),
    path('my-exercises/', views.user_exercises, name='user_exercises'),
    path('exercise-success/', lambda request: render(request, 'workouts/exercise_success.html'), name='exercise_success'),
    path('create-workout-template/', views.create_workout_template, name='create_workout_template'),
    path('workout-template-success/', lambda request: render(request, 'workouts/workout_template_success.html'), name='workout_template_success'),
    path('my-workout-templates/', views.user_workout_templates, name='user_workout_templates'),
    path('edit-workout-template/<int:template_id>/', views.edit_workout_template, name='edit_workout_template'),
    path('create-workout-plan/', views.create_workout_plan, name='create_workout_plan'),
    path('my-workout-plans/', views.user_workout_plans, name='user_workout_plans'),
    path('my-workout-plans-history/', views.user_workout_plans_history, name='user_workout_plans_history'),
    path('workout-plan/<int:workout_id>/', views.workout_plan_detail, name='workout_plan_detail'),
    path('delete-workout-plan/<int:workout_id>/', views.delete_workout_plan, name='delete_workout_plan'),
    path('api/', include('apps.workouts.api_urls')),
]
