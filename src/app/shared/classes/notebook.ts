/* ToDo find these and use them */

export class Notebook {
    key: string;
    current: boolean;
    description: string;
    title: string;
    workouts: Workout[];
}

export class Workout {
    id: string;
    order: number;
}

export class Note {
    key: string;
    exercises: Exercise[];
    title: string;
}

export class Exercise {
    // cols: ExerciseTableCols[];
    title: string;
}

export class ExerciseTableCols {
    reps: number;
    sets: number;
    weight: number;
}

/* ToDo create popular workouts */
export const popularWorkouts = [];
