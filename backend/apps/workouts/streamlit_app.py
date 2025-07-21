import streamlit as st
import pandas as pd
import os
import django
import sys
import json

sys.path.insert(0, os.path.abspath(
    os.path.join(os.path.dirname(__file__), '../../')))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from apps.workouts.models import Workout, Set, Exercise

st.title("Workout Reports")

df = pd.DataFrame()

try:
    workouts = Workout.objects.all().order_by('-date')
    sets = Set.objects.select_related('workout', 'exercise').all()

    if workouts.exists():
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
    else:
        st.warning("No workout data in database. Please upload a JSON file.")
except Exception as db_error:
    st.error(f"Error loading database: {db_error}")
    st.warning("Falling back to file upload.")

if df.empty:
    uploaded_file = st.file_uploader("Upload JSON Workout Data", type=["json"])

    if uploaded_file is not None:
        try:
            raw_json = json.load(uploaded_file)

            flattened_data = []
            for entry in raw_json:
                reps = entry.get("reps", [])
                weights = entry.get("weight_per_set_lbs", [])
                rpes = entry.get("rpe", [])
                num_sets = max(len(reps), len(weights), len(rpes))

                for i in range(num_sets):
                    flattened_data.append({
                        "Date": pd.to_datetime(entry.get("date")),
                        "Program": entry.get("program"),
                        "Day": entry.get("day"),
                        "Exercise Type": entry.get("exercise_type"),
                        "Exercise": entry.get("exercise"),
                        "Set Number": i + 1,
                        "Reps": reps[i] if i < len(reps) else None,
                        "Weight": weights[i] if i < len(weights) else None,
                        "RPE": rpes[i] if i < len(rpes) else None,
                        "Rest (sec)": entry.get("rest_sec"),
                        "Duration (min)": entry.get("duration_minutes"),
                        "Calories Burned": entry.get("calories_burned"),
                        "Body Weight": entry.get("body_weight_lbs"),
                        "Notes": entry.get("notes")
                    })

            df = pd.DataFrame(flattened_data)
            st.success(f"Loaded {len(df)} workout sets from uploaded JSON.")
        except Exception as e:
            st.error(f"Failed to parse JSON: {e}")
    else:
        st.info("Please upload a JSON file to load workout data.")

if not df.empty:
    st.write("### All Workout Sets", df)

    with st.sidebar:
        st.header("Filter Workouts")

        if "Program" in df.columns:
            programs = df['Program'].dropna().unique()
            selected_programs = st.multiselect(
                "Select Program", programs, default=programs)

        if "Exercise Type" in df.columns:
            types = df['Exercise Type'].dropna().unique()
            selected_types = st.multiselect(
                "Select Exercise Type", types, default=types)

        min_date, max_date = df['Date'].min(), df['Date'].max()
        date_range = st.date_input(
            "Date Range", (min_date, max_date), min_value=min_date, max_value=max_date)

    filtered_df = df.copy()

    if "Program" in df.columns:
        filtered_df = filtered_df[filtered_df['Program'].isin(
            selected_programs)]

    if "Exercise Type" in df.columns:
        filtered_df = filtered_df[filtered_df['Exercise Type'].isin(
            selected_types)]

    filtered_df = filtered_df[
        (filtered_df['Date'] >= pd.to_datetime(date_range[0])) &
        (filtered_df['Date'] <= pd.to_datetime(date_range[1]))
    ]

    if "Exercise" in filtered_df.columns and not filtered_df['Exercise'].isnull().all():
        exercises = filtered_df['Exercise'].dropna().unique()
        selected_exercise = st.selectbox("Select Exercise", exercises)

        exercise_df = filtered_df[filtered_df['Exercise']
                                  == selected_exercise].sort_values('Date')

        st.write(f"### Progress for {selected_exercise}")
        st.line_chart(exercise_df.set_index('Date')[['Weight']])

        st.write("### Reps Over Time")
        st.line_chart(exercise_df.set_index('Date')[['Reps']])

        # ✅ RPE Over Time
        if "RPE" in exercise_df.columns and not exercise_df["RPE"].isnull().all():
            st.write("### RPE Over Time")
            st.line_chart(exercise_df.set_index('Date')[['RPE']])
        else:
            st.info("No RPE data available for selected exercise.")

        # ✅ Calories Burned Over Time
        if "Calories Burned" in exercise_df.columns and not exercise_df["Calories Burned"].isnull().all():
            st.write("### Calories Burned Over Time")
            calories_df = exercise_df.drop_duplicates(
                'Date')[['Date', 'Calories Burned']].set_index('Date')
            st.line_chart(calories_df)
        else:
            st.info("No Calories Burned data available.")

        st.write("### Table View")
        st.dataframe(exercise_df)

        st.write("### 📋 Summary Stats")

        col1, col2, col3 = st.columns(3)
        with col1:
            st.metric("Avg Weight", f"{exercise_df['Weight'].mean():.1f} lbs")
            st.metric("Avg Reps", f"{exercise_df['Reps'].mean():.1f}")
        with col2:
            st.metric("Avg RPE", f"{exercise_df['RPE'].mean():.1f}" if exercise_df['RPE'].notna(
            ).any() else "N/A")
            st.metric("Avg Sets/Workout",
                      f"{exercise_df.groupby('Date')['Set Number'].count().mean():.1f}")
        with col3:
            st.metric("Avg Calories Burned",
                      f"{exercise_df['Calories Burned'].dropna().mean():.0f} kcal" if 'Calories Burned' in exercise_df.columns else "N/A")
            st.metric(
                "Avg Duration", f"{exercise_df['Duration (min)'].dropna().mean():.0f} min" if 'Duration (min)' in exercise_df.columns else "N/A")

        if "Calories Burned" in filtered_df.columns and not filtered_df["Calories Burned"].isnull().all():
            st.write("### 🔥 Top Calorie Burn Days")

            calories_summary = (
                filtered_df.drop_duplicates("Date")
                .groupby("Date")["Calories Burned"]
                .sum()
                .sort_values(ascending=False)
                .head(10)
            )

            st.bar_chart(calories_summary)

    else:
        st.warning("No valid 'Exercise' data to visualize.")

else:
    st.info("No workout data available to display.")
