export class Notebook {
    key: string;
    week: Date;
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
    cols: ExerciseTableCols[];
    title: string;
}

export class ExerciseTableCols {
    reps: number;
    sets: number;
    weight: number;
}

// export class Form {
//     constructor(public state = 'inactive') { }
//
//     toggleState() {
//         console.log(this.state);
//         this.state = this.state === 'active' ? 'inactive' : 'active';
//     }
// }

/* ToDo create popular workouts */
export const popularWorkouts = [];
