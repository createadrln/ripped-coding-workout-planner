import {Component, OnInit, Output} from '@angular/core';
import {AngularFireAuth} from 'angularfire2/auth';
import {AngularFireDatabase, AngularFireList} from 'angularfire2/database';
import {NotesService} from '../../services/notes.service';
import {FormControl, FormGroup, FormArray, Validators} from '@angular/forms';
import {Observable} from 'rxjs/Observable';
import {WorkoutNotebooksService} from '../../services/workout-notebooks.service';
import {MembersService} from '../../services/members.service';
import {EventEmitter} from '@angular/core';

/* ToDo use classes correctly in TS variables */
/* ToDo add validation to form */

@Component({
    selector: 'app-workout-note-form',
    templateUrl: './workout-note-form.component.html'
})
export class WorkoutNoteFormComponent implements OnInit {

    @Output() closeEvent = new EventEmitter();

    workoutNoteForm: FormGroup;
    notesRef: AngularFireList<any>;
    notes: Observable<any[]>;

    weeklyWorkoutCollectionRef: AngularFireList<any>;
    weeklyWorkoutCollections: Observable<any[]>;

    addWorkoutNoteCreateNewNotebook = 'hidden';

    constructor(
        private afAuth: AngularFireAuth,
        private db: AngularFireDatabase,
        private memberService: MembersService,
        private notesService: NotesService,
        private workoutNotebooksService: WorkoutNotebooksService
    ) {

        this.afAuth.authState.subscribe(auth => {
            if (auth) {
                this.notesRef = this.notesService.getNotesListRef(auth.uid);
                this.notes = this.notesRef.snapshotChanges().map(changes => {
                    return changes.map(c => ({key: c.payload.key, ...c.payload.val()}));
                });

                this.weeklyWorkoutCollectionRef = this.workoutNotebooksService.getWorkoutNotebookListRef(auth.uid);
                this.weeklyWorkoutCollections = this.weeklyWorkoutCollectionRef.snapshotChanges().map(changes => {
                    return changes.map(c => ({key: c.payload.key, ...c.payload.val()}));
                });
            }
        });
    }
    
    ngOnInit() {

        this.workoutNoteForm = new FormGroup({
            title: new FormControl(),
            description: new FormControl(),
            exercises: new FormArray([
                new FormGroup({
                    title: new FormControl(),
                    reps: new FormControl(),
                    sets: new FormControl(),
                    weight: new FormControl()
                })
            ]),
            createNewNotebook: new FormControl(),
            notebookTitle: new FormControl(),
            notebookDescription: new FormControl(),
            selectedNotebook: new FormControl('Select Workout Notebook')
        });
    }

    /* Add Workout Note */
    addNewExercise() {
        (<FormArray>this.workoutNoteForm.controls['exercises']).push(new FormGroup({
            title: new FormControl(),
            reps: new FormControl(),
            sets: new FormControl(),
            weight: new FormControl()
        }));
    }

    /* Submit and Close Form */
    saveWorkoutNoteForm() {
        this.addWorkoutNote();
        this.addWorkoutNoteCreateNewNotebook = 'hidden';
        this.workoutNoteForm.reset();
        /* ToDo make sure the exercise formArray resets */
        this.closeOnSave();
    }

    /* Save Workout Note */
    addWorkoutNote() {
        const noteTitle = this.workoutNoteForm.value.title;
        const noteDescription = this.workoutNoteForm.value.description;
        const noteExercises = this.workoutNoteForm.value.exercises;

        let newNoteKey: string;

        this.notesRef.push({
            'title': noteTitle,
            'description': noteDescription,
            'exercises': noteExercises
        }).then((note => {
            newNoteKey = note.key;
        }));

        const notebookTitle = this.workoutNoteForm.value.notebookTitle;
        const notebookDescription = this.workoutNoteForm.value.notebookDescription;
        const notebookSelected = this.workoutNoteForm.value.selectedNotebook;
        const notebookCreateNew = this.workoutNoteForm.value.createNewNotebook;

        let notebookKey: string;

        this.afAuth.authState.subscribe(auth => {
            if (auth) {
                if (notebookCreateNew) {
                    this.db.list('/members/' + auth.uid + '/weeks/').push({
                        'title': notebookTitle,
                        'description': notebookDescription,
                    }).then((notebook => {
                        notebookKey = notebook.key;
                    }));
                } else {
                    notebookKey = notebookSelected;
                }

                setTimeout(() => {
                    if (this.addWorkoutNoteCreateNewNotebook === 'visible') {
                        const notebookWorkoutIndex = '/weeks/' + notebookKey + '/workouts/0';

                        this.memberService.getMemberDbObject(auth.uid, notebookWorkoutIndex).set({
                            'selected': newNoteKey
                        });
                    } else {
                        this.weeklyWorkoutCollections.subscribe(workouts => {
                            const workoutNotebooksFilteredBySelectedKey = workouts.filter(workout => notebookKey.includes(workout.key));
                            const selectedWorkoutNotebookWorkoutsIndex = workoutNotebooksFilteredBySelectedKey[0].workouts.length;
                            const notebookWorkoutIndex = '/weeks/' + notebookKey + '/workouts/' + selectedWorkoutNotebookWorkoutsIndex;

                            this.memberService.getMemberDbObject(auth.uid, notebookWorkoutIndex).set({
                                'selected': newNoteKey
                            });
                        });
                    }
                }, 2000);
            }
        });
    }

    toggleCreateNewWorkoutNotebookVisibility() {
        this.addWorkoutNoteCreateNewNotebook = this.addWorkoutNoteCreateNewNotebook === 'visible' ? 'hidden' : 'visible';
    }

    closeOnSave() {
        this.closeEvent.emit();
    }
}
