import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {AngularFireAuth} from 'angularfire2/auth';
import {AngularFireDatabase, AngularFireList, AngularFireObject} from 'angularfire2/database';
import {Observable} from 'rxjs/Observable';

import {trigger, transition, animate, style, state} from '@angular/animations';

import {NotesService} from '../services/notes.service';
import {WorkoutNotebooksService} from '../services/workout-notebooks.service';
import {MembersService} from '../services/members.service';

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

    hasCurrentWorkout = 'false';
    upcomingWeekTitle: string;
    upcomingWeekDescription: string;
    weeklyWorkouts: Observable<any>;

    formWorkoutNoteVisibilityState = 'inactive';
    formWorkoutNotebookVisibilityState = 'inactive';
    hideWorkoutRowInputs = [];

    ngOnInit() {
    }

    constructor(
        private afAuth: AngularFireAuth,
        private db: AngularFireDatabase,
        private router: Router,
        private membersService: MembersService,
        private notesService: NotesService,
        private workoutNotebooksService: WorkoutNotebooksService
    ) {

        this.afAuth.authState.subscribe(auth => {

            if (!auth) {
                this.router.navigateByUrl('/login');
            } else {

                /* Workout Note Observables */
                this.notesRef = this.notesService.getNotesListRef(auth.uid);
                this.notes = this.notesRef.snapshotChanges().map(changes => {
                    return changes.map(c => ({key: c.payload.key, ...c.payload.val()}));
                });

                /* Workout Collection Observables */
                this.weeklyWorkoutCollectionRef = this.workoutNotebooksService.getWorkoutNotebookListRef(auth.uid);
                this.weeklyWorkoutCollections = this.weeklyWorkoutCollectionRef.snapshotChanges().map(changes => {
                    return changes.map(c => ({key: c.payload.key, ...c.payload.val()}));
                });

                /* Get Currently Selected Workout Collection From Observable */
                this.weeklyWorkoutCollections.subscribe(collections => {
                    const getCurrentCollection = collections.filter(collection => collection.current);

                    /* ToDo create from popular workouts */
                    if (getCurrentCollection.length > 0) {
                        const upcomingWorkouts = getCurrentCollection[0].workouts;

                        this.hasCurrentWorkout = 'true';
                        this.upcomingWeekTitle = getCurrentCollection[0].title;
                        this.upcomingWeekDescription = getCurrentCollection[0].description;
                        this.weeklyWorkouts = this.getWeeklyWorkoutNotes(this.notesRef, upcomingWorkouts);
                    }
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
            const getCurrentCollection = weeks.filter(week => week.current);
            const upcomingWorkouts = getCurrentCollection[0].workouts;

            this.upcomingWeek = getCurrentCollection[0].week;
            this.upcomingWeekDescription = getCurrentCollection[0].description;

            return this.weeklyWorkouts = this.getWeeklyWorkoutNotes(this.notesRef, upcomingWorkouts);
        });
    }

    /* ToDo move to helper */
    selectNewWorkoutCollection(ev) {
        this.afAuth.authState.subscribe(auth => {
            if (auth) {
                this.workoutNotebooksService.removeCurrentWeekToggleData(auth.uid, this.weeklyWorkoutCollections);
                this.updateCurrentWeekToggleData(auth.uid, ev);
            }
        });
    }

    /* Edit and Save a Workout Collection Note Row Action */
    saveWorkoutNoteRowUpdate(
        noteKey,
        exerciseRowIndex,
        currentSets,
        currentReps,
        currentWeight,
        newEditRowSets,
        newEditRowReps,
        newEditRowWeight
    ) {
        let updateReps = currentReps;
        let updateSets = currentSets;
        let updateWeight = currentWeight;

        if (newEditRowSets) { updateSets = newEditRowSets; }
        if (newEditRowReps) { updateReps = newEditRowReps; }
        if (newEditRowWeight) { updateWeight = newEditRowWeight; }

        this.afAuth.authState.subscribe(auth => {
            if (auth) {
                this.membersService.getMemberDbObject(auth.uid, '/notes/' + noteKey + '/exercises/' + exerciseRowIndex).set({
                    'reps': updateReps,
                    'sets': updateSets,
                    'weight': updateWeight
                });
            }
        });

        this.hideWorkoutRowInputs = [];
    }

    /* ToDo move to service */
    deleteNote(noteKey: string) {
        this.afAuth.authState.subscribe(auth => {
            if (auth) {
                /* ToDo add 'are you sure you want to do this' message */
                /* https://www.npmjs.com/package/angular-alert-module */
                this.db.list('/members/' + auth.uid + '/notes').remove(noteKey);
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

    closeEventReceived($event) {
        this.formWorkoutNoteVisibilityState = 'inactive';
    }
}
