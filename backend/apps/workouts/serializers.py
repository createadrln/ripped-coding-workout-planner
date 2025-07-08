from rest_framework import serializers
from .models import Exercise, Workout, WorkoutTemplate, Set

class ExerciseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Exercise
        fields = '__all__'

class WorkoutTemplateSerializer(serializers.ModelSerializer):
    exercises = ExerciseSerializer(many=True, read_only=True)
    class Meta:
        model = WorkoutTemplate
        fields = '__all__'

class SetSerializer(serializers.ModelSerializer):
    class Meta:
        model = Set
        fields = '__all__'

class WorkoutSerializer(serializers.ModelSerializer):
    sets = SetSerializer(many=True, read_only=True)
    templates = WorkoutTemplateSerializer(many=True, read_only=True)
    class Meta:
        model = Workout
        fields = '__all__'