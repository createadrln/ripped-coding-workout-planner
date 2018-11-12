import {Component, OnInit, Output} from '@angular/core';
import {AngularFireAuth} from 'angularfire2/auth';
import {AngularFireDatabase, AngularFireList} from 'angularfire2/database';
import {NotesService} from '../../services/notes.service';
import {FormControl, FormGroup, FormArray, Validators} from '@angular/forms';
import {Observable} from 'rxjs/Observable';
import {takeUntil} from 'rxjs/operators';
import {WorkoutNotebooksService} from '../../services/workout-notebooks.service';
import {MembersService} from '../../services/members.service';
import {EventEmitter} from '@angular/core';

/* ToDo use classes correctly in TS variables */

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
    weeklyWorkoutCollectionsObs: Observable<any[]>;

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
                this.weeklyWorkoutCollectionsObs = this.weeklyWorkoutCollectionRef.snapshotChanges().map(changes => {
                    return changes.map(c => ({key: c.payload.key, ...c.payload.val()}));
                });
            }
        });
    }

    ngOnInit() {
        this.workoutNoteForm = new FormGroup({
            title: new FormControl(null, Validators.required),
            description: new FormControl(null, Validators.required),
            exercises: new FormArray([
                new FormGroup({
                    title: new FormControl(null, Validators.required),
                    reps: new FormControl(null, Validators.required),
                    sets: new FormControl(null, Validators.required),
                    weight: new FormControl(null, Validators.required)
                })
            ]),
            selectedNotebook:  new FormControl(),
            createNewNotebook: new FormControl(),
            notebookTitle: new FormControl(),
            notebookTags: new FormControl()
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

    /* ToDo make sure the exercise formArray resets */
    /* Submit and Close Form */
    saveWorkoutNoteForm() {
        this.addWorkoutNote();
        this.workoutNoteForm.reset();
        this.closeOnSave();
    }

    /* Save Workout Note */
    addWorkoutNote() {
        const noteTitle = this.workoutNoteForm.value.title;
        const noteDescription = this.workoutNoteForm.value.description;
        const noteExercises = this.workoutNoteForm.value.exercises;
        const notebookTitle = this.workoutNoteForm.value.notebookTitle;

        const notebookTags = this.workoutNoteForm.value.notebookTags;
        const notebookSelected = this.workoutNoteForm.value.selectedNotebook;
        const notebookCreateNew = this.workoutNoteForm.value.createNewNotebook;

        let notebookKey: string;
        let newNoteKey: string;

        this.afAuth.authState.subscribe(auth => {
            if (auth) {

                this.db.list('/members/' + auth.uid + '/notes/').push({
                    'title': noteTitle,
                    'description': noteDescription,
                    'exercises': noteExercises
                }).then(note => {
                    newNoteKey = note.key;
                });

                if (notebookCreateNew) {
                    this.db.list('/members/' + auth.uid + '/weeks/').push({
                        'title': notebookTitle,
                        'tags': notebookTags,
                    }).then((notebook => {
                        notebookKey = notebook.key;
                    }));
                } else {
                    notebookKey = notebookSelected;
                }

                /* Runs after timeout so that the note and notebook keys are available in Firebase */
                setTimeout(() => {
                    if (notebookCreateNew) {
                        const notebookWorkoutIndex = '/weeks/' + notebookKey + '/workouts/0';

                        this.memberService.getMemberDbObject(auth.uid, notebookWorkoutIndex).set({
                            'selected': newNoteKey
                        });
                    } else {
                        const notebookArray = notebookKey.split(',');
                        const notebookWorkoutCount = notebookArray[1];
                        const notebookWorkoutIndex = '/weeks/' + notebookArray[0] + '/workouts/' + notebookWorkoutCount;

                        this.memberService.getMemberDbObject(auth.uid, notebookWorkoutIndex).set({
                            'selected': newNoteKey
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
