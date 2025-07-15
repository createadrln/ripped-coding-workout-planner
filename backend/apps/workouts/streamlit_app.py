import streamlit as st
import pandas as pd
import os
import django
import sys

# Ensure the backend directory (which contains config/) is in sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '../../')))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from apps.workouts.models import Workout, Set, Exercise

st.title("Workout Reports")

workouts = Workout.objects.all().order_by('-date')
sets = Set.objects.select_related('workout', 'exercise').all()

if not workouts.exists():
    st.info("No workout data available.")
else:
    # Build a DataFrame for visualization
    data = []
    for s in sets:
        data.append({
            'Date': s.workout.date,
            'Exercise': s.exercise.name,
            'Muscle Group': s.exercise.muscle_group,
            'Weight': float(s.weight),
            'Reps': s.reps,
            'Set Number': s.set_number,
        })
    df = pd.DataFrame(data)
    st.write("### All Workout Sets", df)

    exercises = df['Exercise'].unique()
    selected_exercise = st.selectbox("Select Exercise", exercises)
    filtered = df[df['Exercise'] == selected_exercise]

    st.write(f"### Progress for {selected_exercise}")
    st.line_chart(filtered.sort_values('Date')[['Date', 'Weight']].set_index('Date'))

    st.write("### Reps Over Time")
    st.line_chart(filtered.sort_values('Date')[['Date', 'Reps']].set_index('Date'))