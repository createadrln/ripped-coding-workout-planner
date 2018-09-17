import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {AngularFireAuth} from 'angularfire2/auth';
import {AngularFireDatabase, AngularFireList, AngularFireObject} from 'angularfire2/database';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import {trigger, transition, animate, style, state} from '@angular/animations';

import {NotesService} from '../services/notes.service';
import {WorkoutNotebooksService} from '../services/workout-notebooks.service';

// import {Form} from '../classes/workout-notebook';

@Component({
    selector: 'app-notes',
    templateUrl: './notes.component.html',
    animations: [
        trigger('formSlideIn', [
            state('inactive', style({
                display: 'none',
                transform: 'translateX(-100%)'
            })),
            state('active',   style({
                display: 'block',
                transform: 'translateX(0%)'
            })),
            transition('inactive => active', [
                animate('400ms ease-out', style({transform: 'translateX(0%)'}))
            ]),
            transition('active => inactive', [
                animate('400ms ease-in', style({transform: 'translateX(-100%)'}))
            ])
        ])
    ]
})

export class NotesComponent implements OnInit {

    user: AngularFireObject<any>;

    notesRef: AngularFireList<any>;
    notes: Observable<any[]>;

    weeklyWorkoutCollectionRef: AngularFireList<any>;
    weeklyWorkoutCollections: Observable<any[]>;

    upcomingWeek = new Date();

    upcomingWeekTitle: string;
    upcomingWeekDescription: string;
    weeklyWorkouts: Observable<any>;

    formWorkoutNoteVisibilityState = 'active';
    formWorkoutNotebookVisibilityState = 'inactive';

    ngOnInit() {
    }

    constructor(
        private afAuth: AngularFireAuth,
        private db: AngularFireDatabase,
        private router: Router,
        private notesService: NotesService,
        private workoutNotebooksService: WorkoutNotebooksService
    ) {

        this.afAuth.authState.subscribe(auth => {

            if (!auth) {

                this.router.navigateByUrl('/login');

            } else {

                this.notesRef = this.notesService.getNotesListRef(auth.uid);
                this.notes = this.notesRef.snapshotChanges().map(changes => {
                    return changes.map(c => ({key: c.payload.key, ...c.payload.val()}));
                });

                this.weeklyWorkoutCollectionRef = this.workoutNotebooksService.getWorkoutNotebookListRef(auth.uid);
                this.weeklyWorkoutCollections = this.weeklyWorkoutCollectionRef.snapshotChanges().map(changes => {
                    return changes.map(c => ({key: c.payload.key, ...c.payload.val()}));
                });

                this.weeklyWorkoutCollections.subscribe(weeks => {

                    const getCurrentWeek = weeks.filter(week => week.current);

                    /* ToDo if no workouts exist error message and directions */
                    /* ToDo create from popular workouts */
                    const upcomingWorkouts = getCurrentWeek[0].workouts;

                    this.upcomingWeekTitle = getCurrentWeek[0].title;
                    this.upcomingWeekDescription = getCurrentWeek[0].description;

                    /* Get currently selected weekly workouts filtered by currently selected week*/
                    this.weeklyWorkouts = this.getWeeklyWorkoutNotes(this.notesRef, upcomingWorkouts);

                });
            }
        });
    }

    /* ToDo move to service */
    getWeeklyWorkoutNotes(notesRef, upcomingWorkouts) {
        const upcomingWorkoutsVal = upcomingWorkouts.map(val => val.selected);
        return notesRef.snapshotChanges().map(notes => {
            const filtered = notes.filter(note => upcomingWorkoutsVal.includes(note.key));
            return filtered.map(c => ({key: c.payload.key, ...c.payload.val()}));
        });
    }

    /* ToDo move to service or helper */
    updateCurrentWeekToggleData(auth, workoutCollection) {
        this.db.object('/members/' + auth + '/weeks/' + workoutCollection).update({
            'current': true
        });

        this.weeklyWorkoutCollections.subscribe(weeks => {

            const getCurrentWeek = weeks.filter(week => week.current);
            const upcomingWorkouts = getCurrentWeek[0].workouts;

            this.upcomingWeek = getCurrentWeek[0].week;
            this.upcomingWeekDescription = getCurrentWeek[0].description;

            return this.weeklyWorkouts = this.getWeeklyWorkoutNotes(this.notesRef, upcomingWorkouts);
        });
    }

    /* ToDo move to helper */
    selectNewWorkoutCollection(ev) {
        this.afAuth.authState.subscribe(auth => {
            if (auth) {
                this.workoutNotebooksService.removeCurrentWeekToggleData(auth.uid, this.weeklyWorkoutCollections);
                this.updateCurrentWeekToggleData(auth.uid, ev.value);
            }
        });
    }

    /* Edit Workout Note Row */
    // editWorkoutNoteRow(key, index) {
    //     console.log(index);
    //     console.log(key);
    //     return null;
    // }

    /* ToDo move to service */
    deleteNote(note: any) {
        this.afAuth.authState.subscribe(auth => {
            if (auth) {
                this.db.list('/members/' + auth.uid + '/notes').remove(note.key);
            }
        });
    }

    /* ToDo move to service */
    createNewNoteRow(noteKey, rowsCount, rowTitle, rowReps, rowSets, rowWeight) {
        this.afAuth.authState.subscribe(auth => {
            if (auth) {
                this.db.object('/members/' + auth.uid + '/notes/' + noteKey + /exercises/ + rowsCount).set({
                    'title': rowTitle,
                    'reps': rowReps,
                    'sets': rowSets,
                    'weight': rowWeight
                });
            }
        });
    }

    /* ToDo move to service */
    deleteNoteRow(noteKey, exercise, exerciseIndex): void {
        this.afAuth.authState.subscribe(auth => {
            if (auth) {
                this.db.list('/members/' + auth.uid + '/notes/' + noteKey + '/exercises/');
            }
        });
    }

    toggleWorkoutNotebookFormState() {
        this.formWorkoutNotebookVisibilityState = this.formWorkoutNotebookVisibilityState === 'active' ? 'inactive' : 'active';
    }

    toggleWorkoutNoteFormState() {
        this.formWorkoutNoteVisibilityState = this.formWorkoutNoteVisibilityState === 'active' ? 'inactive' : 'active';
    }
}
