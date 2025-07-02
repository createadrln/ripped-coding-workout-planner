from django.contrib.auth import authenticate, login
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User
from django.shortcuts import render, redirect, get_object_or_404
from django.http import JsonResponse
from .models import Exercise, WorkoutTemplate


def home(request):
    return JsonResponse({"message": "Welcome to the Django backend!"})


def about(request):
    return JsonResponse({"message": "This is the about page."})


def user_login(request):
    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')
        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            return redirect('home')
        else:
            return render(request, 'login.html', {'error': 'Invalid credentials'})
    return render(request, 'login.html')


def register(request):
    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')
        if User.objects.filter(username=username).exists():
            return render(request, 'register.html', {'error': 'Username already exists'})
        user = User.objects.create_user(username=username, password=password)
        login(request, user)
        return redirect('/')  # Change 'home' to your desired redirect
    return render(request, 'register.html')


@login_required
def create_exercise(request):
    if request.method == 'POST':
        name = request.POST.get('name')
        description = request.POST.get('description', '')
        muscle_group = request.POST.get('muscle_group', '')
        max_weight = request.POST.get('max_weight') or None
        max_reps = request.POST.get('max_reps') or None
        if name:
            Exercise.objects.create(
                name=name,
                description=description,
                muscle_group=muscle_group,
                max_weight=max_weight if max_weight else None,
                max_reps=max_reps if max_reps else None
            )
            return redirect('exercise_success')
        else:
            return render(request, 'create_exercise.html', {'error': 'Name is required'})
    return render(request, 'create_exercise.html')


@login_required
def create_workout_template(request):
    exercises = Exercise.objects.all()
    if request.method == 'POST':
        name = request.POST.get('name')
        description = request.POST.get('description', '')
        selected_exercises = request.POST.getlist('exercises')
        if name:
            template = WorkoutTemplate.objects.create(
                name=name,
                description=description,
                user=request.user
            )
            template.exercises.set(selected_exercises)
            return redirect('workout_template_success')
        else:
            return render(request, 'create_workout_template.html', {
                'error': 'Name is required',
                'exercises': exercises
            })
    return render(request, 'create_workout_template.html', {'exercises': exercises})


@login_required
def user_workout_templates(request):
    templates = WorkoutTemplate.objects.filter(
        user=request.user)  # Only show user's templates
    return render(request, 'user_workout_templates.html', {'templates': templates})


@login_required
def edit_workout_template(request, template_id):
    template = get_object_or_404(
        WorkoutTemplate, id=template_id, user=request.user)
    exercises = Exercise.objects.all()
    if request.method == 'POST':
        name = request.POST.get('name')
        description = request.POST.get('description', '')
        selected_exercises = request.POST.getlist('exercises')
        if name:
            template.name = name
            template.description = description
            template.save()
            template.exercises.set(selected_exercises)
            return redirect('user_workout_templates')
        else:
            return render(request, 'edit_workout_template.html', {
                'template': template,
                'exercises': exercises,
                'error': 'Name is required'
            })
    return render(request, 'edit_workout_template.html', {
        'template': template,
        'exercises': exercises
    })
