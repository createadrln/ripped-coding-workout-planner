from django.contrib.auth.decorators import login_required
from django.shortcuts import render, redirect, get_object_or_404
from django.views.decorators.http import require_http_methods
from apps.workouts.models import Exercise, WorkoutTemplate, Workout, Set
from django.contrib import messages
from django.http import JsonResponse


def home(request):
    return JsonResponse({"message": "Welcome to the Django backend!"})


def about(request):
    return JsonResponse({"message": "This is the about page."})


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
            return render(request, 'workouts/create_exercise.html', {'error': 'Name is required'})
    return render(request, 'workouts/create_exercise.html')


@login_required
def user_exercises(request):
    exercises = Exercise.objects.filter(user=request.user)
    return render(request, 'workouts/user_exercises.html', {'exercises': exercises})


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
            return render(request, 'workouts/create_workout_template.html', {
                'error': 'Name is required',
                'exercises': exercises
            })
    return render(request, 'workouts/create_workout_template.html', {'exercises': exercises})


@login_required
def user_workout_templates(request):
    templates = WorkoutTemplate.objects.filter(user=request.user)
    return render(request, 'workouts/user_workout_templates.html', {'templates': templates})


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
            return render(request, 'workouts/edit_workout_template.html', {
                'template': template,
                'exercises': exercises,
                'error': 'Name is required'
            })
    return render(request, 'workouts/edit_workout_template.html', {
        'template': template,
        'exercises': exercises
    })


@login_required
def create_workout_plan(request):
    templates = WorkoutTemplate.objects.filter(user=request.user)
    if request.method == 'POST':
        selected_templates = request.POST.getlist('templates')
        date = request.POST.get('date')
        notes = request.POST.get('notes', '')
        if selected_templates and date:
            workout = Workout.objects.create(date=date, notes=notes)
            workout.templates.set(selected_templates)
            workout.user = request.user
            workout.save()
            selected_templates_objs = WorkoutTemplate.objects.filter(
                id__in=selected_templates, user=request.user)
            return render(request, 'workouts/workout_plan_created.html', {
                'workout': workout,
                'selected_templates': selected_templates_objs
            })
        else:
            return render(request, 'workouts/create_workout_plan.html', {
                'templates': templates,
                'error': 'Please select at least one template and a date.'
            })
    return render(request, 'workouts/create_workout_plan.html', {'templates': templates})


@login_required
def user_workout_plans(request):
    workouts = Workout.objects.filter(user=request.user).order_by('-date')
    return render(request, 'workouts/user_workout_plans.html', {'workouts': workouts})


@login_required
@require_http_methods(["GET", "POST"])
def workout_plan_detail(request, workout_id):
    workout = get_object_or_404(Workout, id=workout_id, user=request.user)
    templates = workout.templates.all()
    exercises = []
    for template in templates:
        for exercise in template.exercises.all():
            if exercise not in exercises:
                exercises.append(exercise)

    next_set_numbers = {}
    for exercise in exercises:
        highest_set = workout.sets.filter(
            exercise=exercise).order_by('-set_number').first()
        next_set_numbers[exercise.id] = (
            highest_set.set_number + 1) if highest_set else 1

    if request.method == 'POST':
        for exercise in exercises:
            weight = request.POST.get(f'weight_{exercise.id}')
            reps = request.POST.get(f'reps_{exercise.id}')
            set_number = request.POST.get(
                f'set_number_{exercise.id}', next_set_numbers[exercise.id])
            if weight or reps or set_number:
                Set.objects.create(
                    workout=workout,
                    exercise=exercise,
                    weight=weight if weight else 0,
                    reps=reps if reps else 0,
                    set_number=set_number if set_number else 1
                )
        return redirect('user_workout_plans')

    sets = workout.sets.all()
    return render(request, 'workouts/workout_plan_detail.html', {
        'workout': workout,
        'templates': templates,
        'exercises': exercises,
        'sets': sets,
        'next_set_numbers': next_set_numbers
    })


@login_required
def delete_workout_plan(request, workout_id):
    workout = get_object_or_404(Workout, id=workout_id, user=request.user)
    if request.method == 'POST':
        workout.delete()
        messages.success(request, "Workout plan deleted successfully.")
        return redirect('user_workout_plans')
    return render(request, 'workouts/delete_workout_plan.html', {'workout': workout})
