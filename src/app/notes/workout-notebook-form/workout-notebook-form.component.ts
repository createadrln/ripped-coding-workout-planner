import {Component, OnInit, Output} from '@angular/core';
import {AngularFireAuth} from 'angularfire2/auth';
import {FormControl, FormGroup, FormBuilder, FormArray, Validators} from '@angular/forms';
import {Note} from '../../classes/workout-notebook';
import {MembersService} from '../../services/members.service';
import {AngularFireList} from 'angularfire2/database';
import {Observable} from 'rxjs/Observable';
import {NotesService} from '../../services/notes.service';
import {WorkoutNotebooksService} from '../../services/workout-notebooks.service';

/* ToDo use classes correctly in TS variables */

@Component({
    selector: 'app-workout-notebook-form',
    templateUrl: './workout-notebook-form.component.html',
    styleUrls: ['./workout-notebook-form.component.css']
})
export class WorkoutNotebookFormComponent implements OnInit {

    workoutNotebookForm: FormGroup;
    notesRef: AngularFireList<any>;
    notes: Observable<Note[]>;

    weeklyWorkoutCollectionRef: AngularFireList<any>;
    weeklyWorkoutCollections: Observable<any[]>;

    addWorkoutNotebookFormSubmitted =  false;

    constructor(
        private afAuth: AngularFireAuth,
        private memberService: MembersService,
        private notesService: NotesService,
        private workoutNotebooksService: WorkoutNotebooksService,
        private fb: FormBuilder
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
                this.notes.subscribe(res => {
                    const workoutGroup = (<FormArray>this.workoutNotebookForm.controls['workouts']).at(0).get('workoutGroup') as FormArray;

                    workoutGroup.removeAt(0);
                    for (let i = 0; i < res.length; i++) {
                        workoutGroup.push(this.fb.group({
                            'key': res[i].key,
                            'title': res[i].title
                        }));
                    }
                });
            }
        });
    }

    ngOnInit() {
        this.workoutNotebookForm = new FormGroup({
            current: new FormControl(),
            title: new FormControl(null, Validators.required),
            description: new FormControl(null),
            workouts: new FormArray([
                new FormGroup({
                    workoutGroup: new FormArray([
                        new FormGroup({
                            key: new FormControl(),
                            title: new FormControl()
                        }),
                    ]),
                    selected: new FormControl(null, Validators.required)
                })
            ])
        });
    }

    /*
    Add new workout to notebook
     */
    addWorkoutToNotebook(index) {
        this.notes.subscribe(res => {
            (<FormArray>this.workoutNotebookForm.controls['workouts']).push(
                new FormGroup({
                    workoutGroup: new FormArray([
                        new FormGroup({
                            key: new FormControl(),
                            title: new FormControl()
                        })
                    ]),
                    selected: new FormControl()
                })
            );
            const workoutGroup = (<FormArray>this.workoutNotebookForm.controls['workouts']).at(index).get('workoutGroup') as FormArray;
            workoutGroup.removeAt(0);
            for (let i = 0; i < res.length; i++) {
                workoutGroup.push(this.fb.group({
                    'key': res[i].key,
                    'title': res[i].title
                }));
            }
        });
    }

    /*
    Add to selected workouts
     */
    addSelectedWorkout(index, value) {
        const workoutsArr = (<FormArray>this.workoutNotebookForm.controls['workouts']).at(index);
        workoutsArr['controls'].selected.setValue(value);
    }

     /*
    Save Workout Notebook Form
     */
    addWorkoutNotebook() {
        this.afAuth.authState.subscribe(auth => {
            if (auth) {

                if (this.workoutNotebookForm.value.current) {
                    this.workoutNotebooksService.removeCurrentWeekToggleData(auth.uid, this.weeklyWorkoutCollections);
                }

                const workouts = this.workoutNotebookForm.value.workouts;
                for (let i = 0; i < workouts.length; i++) {
                    workouts[i].workoutGroup = null;
                }

                this.weeklyWorkoutCollectionRef.push({
                    'current': this.workoutNotebookForm.value.current,
                    'title': this.workoutNotebookForm.value.title,
                    'description': this.workoutNotebookForm.value.description,
                    'workouts': workouts
                });

                this.addWorkoutNotebookFormSubmitted = true;

            }
        });
    }
}
