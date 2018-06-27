import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase, AngularFireList, AngularFireObject } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

@Component({
    selector: 'app-notes',
    templateUrl: './notes.component.html',
    styleUrls: []
})

export class NotesComponent implements OnInit {

    // Firebase observerables
    user: AngularFireObject<any>;

    // General Notes Variables
    notesRef: AngularFireList<any>;
    notes: Observable<any[]>;

    // Weekly Notes Variables
    weeklyWorkoutCollectionRef: AngularFireList<any>;
    weeklyWorkoutCollections: Observable<any[]>;

    upcomingWeek = new Date();
    upcomingWeekDescription: string;
    weeklyWorkouts: Observable<any>;

    // New Workout Collection Variables
    newWorkoutCollectionDate = null;
    newWeeklyGoalsTextareaValue = null;
    newWeeklyWorkoutWorkouts = null;
    newWeeklyWorkoutCollectionCurrentToggle = false;

    // New Note Variables
    newNoteTextareaValue = null;
    newNoteExerciseValue = null;
    newNoteExercisesRowSetup = Array(1);
    newNoteExercisesColsSetup = Array(3);
    newNoteExercisesChildColsSetup = Array(3);

    // Initial variable settings
    rowCols = [];
    addNote = false;
    addWorkoutCollection = false;
    addWeeklyWorkout = false;
    editRowValues = null;
    addChildRowValues = null;

    ngOnInit() {
    }

    constructor(private afAuth: AngularFireAuth, private db: AngularFireDatabase) {

        this.afAuth.authState.subscribe(auth => {

            if (auth) {

                /* This observes workout notes for a user */
                this.notesRef = this.getMemberDbList(auth.uid, '/notes');
                this.notes = this.getAllNotes(this.notesRef);

                /* This observes workout weeks for a user */
                this.weeklyWorkoutCollectionRef = this.getMemberDbList(auth.uid, '/weeks');
                this.weeklyWorkoutCollections = this.weeklyWorkoutCollectionRef.snapshotChanges().map(changes => {
                    return changes.map(c => ({key: c.payload.key, ...c.payload.val()}));
                });

                /* Gets upcoming week */
                this.weeklyWorkoutCollections.subscribe(weeks => {

                    const getCurrentWeek = weeks.filter(week => week.current);
                    const upcomingWorkouts = getCurrentWeek[0].workouts;

                    this.upcomingWeek = getCurrentWeek[0].week;
                    this.upcomingWeekDescription = getCurrentWeek[0].description;

                    /* Get currently selected weekly workouts filtered by currently selected week*/
                    this.weeklyWorkouts = this.getWeeklyWorkoutNotes(this.notesRef, upcomingWorkouts);
                });
            }
        });
    }

    /* Gets Firebase List */
    /* ToDo move to service */
    getMemberDbList(auth, path) {
        if (path) {
            return this.db.list('/members/' + auth + path);
        } else {
            return this.db.list('/members/' + auth);
        }
    }

    /* Gets Firebase Object */
    /* ToDo move to service */
    getMemberDbObject(auth, path) {
        if (path) {
            return this.db.object('/members/' + auth + path);
        } else {
            return this.db.object('/members/' + auth);
        }
    }

    /* Gets upcoming week */
    /* ToDo move to service */
    getWeeklyWorkoutNotes(notesRef, upcomingWorkouts) {
        /* Filters by selected upcoming workout key */
        return notesRef.snapshotChanges().map(notes => {
            const filtered = notes.filter(note => upcomingWorkouts.includes(note.key));
            return filtered.map(c => ({key: c.payload.key, ...c.payload.val()}));
        });

        /* Stuff that's not being used */
        function notUsing() {
            /* Will return weeks */
            /* Probably not necessary with current week toggle */
            // weeks.map((item, index) => {
            /* Need a way to easily set the weeks workouts for usage */
            /* ToDo only remove previous dates beyond the nearest Sunday */
            /* ToDo or is it easier to create a toggle setting a date to be the current week workout */
            /* I think maybe a toggle would be a better idea */

            /* Automatic Week by Nearest Set Date? */
            /* Compare Remaining Dates and Pick the one closest to today */
            /* If today is Sunday pick the closest date forward in time equal to or greater than today */
            /* If today is greater than Sunday pick the previous date that is between today and the previous Sunday */
            /* Or pick the next closest forward in time */

            /* Remove ALL Previous Dates */
            /* Make date private? */
            // const date = Date();
            // const dateParsed = Date.parse(date);
            // const itemDateParse = Date.parse(item.week);
            // if (itemDateParse < dateParsed) {
            //     weeks.splice(index, 1);
            // }

            /* Trying to filter */
            // const filteredByNextDate = item.filter(item => upcomingWorkouts.includes(item.key));
            // console.log(index);
            // });

            // const upcomingWeekArr = [];
            // const savedWeekCount = weeks.length;
            //
            // let upcomingWeekDate = Date;
            // let upcomingWeekDescription: string;
            // let upcomingWorkouts = [];

            // for (let upcomingWeekIndex = 0; upcomingWeekIndex < savedWeekCount; upcomingWeekIndex++) {

            // upcomingWeekArr.push({
            //     'week': weeks[upcomingWeekIndex].week,
            //     'description': weeks[upcomingWeekIndex].description,
            //     'workouts': weeks[upcomingWeekIndex].workouts
            // });

            // if (upcomingWeekIndex + 1 === savedWeekCount) {
            // console.log(upcomingWeekArr);
            // }

            /* Old method to get closest date */
            // upcomingWeekDate = upcomingWeekArr[0].week;
            // upcomingWeekDescription = upcomingWeekArr[0].description;
            // upcomingWorkouts = upcomingWeekArr[0].workouts;
            //
            // if (upcomingWeekDate > upcomingWeekArr[upcomingWeekIndex].week) {
            //     upcomingWeekDate = upcomingWeekArr[upcomingWeekIndex].week;
            //     upcomingWeekDescription = upcomingWeekArr[upcomingWeekIndex].description;
            //     upcomingWorkouts = upcomingWeekArr[upcomingWeekIndex].workouts;
            // }
            // }

            /* Todo filter notes by upcomingWorkouts */
            /* Ref: https://angularfirebase.com/lessons/reactive-crud-app-with-angular-and-firebase-tutorial/ */

            /* Todo Firebase sucks with queries. Firestore might work better */
            /* Ref: https://www.learnrxjs.io/operators/filtering/filter.html */
        }
    }

    /* Add a Weekly Workout Collection */
    /* ToDo update function and variables to use weekly namespace */
    /* ToDo move to service */
    /* Todo add edit or duplicate a week */
    addNewWorkoutCollection(workoutCollection) {
        this.afAuth.authState.subscribe(auth => {

            if (auth) {

                this.removeCurrentWeekToggleData(auth.uid);

                const weekBeginsDate = workoutCollection.form.value.newWorkoutCollectionDate;
                const attachedWorkouts = workoutCollection.form.value.newWeeklyWorkoutWorkouts;

                let weekBeginsDateFormatted = null;

                if (weekBeginsDate) {
                    weekBeginsDateFormatted = workoutCollection.form.value.newWorkoutCollectionDate.toDateString();
                } else {
                    weekBeginsDateFormatted = 'Anytime';
                }

                this.weeklyWorkoutCollectionRef.push({
                    'current': workoutCollection.form.value.newWeeklyWorkoutCollectionCurrentToggle,
                    'week': weekBeginsDateFormatted,
                    'description': this.newWeeklyGoalsTextareaValue,
                    'workouts': attachedWorkouts
                });

                this.addWorkoutCollection = false;
            }
        });
    }

    /* Remove existing week toggle data */
    /* ToDo move to service */
    removeCurrentWeekToggleData(auth) {
        this.weeklyWorkoutCollections.subscribe(weeks => {
            const oldCurrentWeek = weeks.filter(week => week.current);
            this.db.list('/members/' + auth + '/weeks/' + oldCurrentWeek[0].key).remove('current');
        });
    }

    /* Remove existing week toggle data */
    /* ToDo move to service */
    updateCurrentWeekToggleData(auth, workoutCollection) {
        this.db.object('/members/' + auth + '/weeks/' + workoutCollection).update({
            'current': true
        });

        /* Gets upcoming week */
        this.weeklyWorkoutCollections.subscribe(weeks => {

            const getCurrentWeek = weeks.filter(week => week.current);
            const upcomingWorkouts = getCurrentWeek[0].workouts;

            this.upcomingWeek = getCurrentWeek[0].week;
            this.upcomingWeekDescription = getCurrentWeek[0].description;

            /* Get currently selected weekly workouts filtered by currently selected week*/
            return this.weeklyWorkouts = this.getWeeklyWorkoutNotes(this.notesRef, upcomingWorkouts);
        });
    }

    /* Update current week from dropdown */
    /* ToDo move to helper */
    selectNewWorkoutCollection(ev) {
        this.afAuth.authState.subscribe(auth => {
            if (auth) {
                this.removeCurrentWeekToggleData(auth.uid);
                this.updateCurrentWeekToggleData(auth.uid, ev.value);
            }
        });
    }

    /* Get workout goal description from form */
    /* ToDo move to helper */
    newWorkoutCollectionDescriptionChange(ev) {
        this.newWeeklyGoalsTextareaValue = ev.target.value;
    }

    /* Add a Note */
    /* Todo add first exercise/row to note */
    /* ToDo move to service */
    addNewNote(note) {
        this.afAuth.authState.subscribe(auth => {
            if (auth) {
                this.notesRef.push({
                    'title': note.value.newNoteTitle,
                    'description': this.newNoteTextareaValue,
                    'exercises': {
                        '0': {
                            'title': note.value.newNoteExerciseTitle,
                            'cols': this.rowCols
                        }
                    }
                });
                this.addNote = false;
            }
        });
    }

    /* Get Notes */
    /* ToDo move to service */
    getAllNotes(notes) {
        return notes.snapshotChanges().map(changes => {
            return changes.map(c => ({key: c.payload.key, ...c.payload.val()}));
        });
    }

    /* Delete Note --- DONE */
    /* ToDo move to service */
    deleteNote(note: any) {
        this.afAuth.authState.subscribe(auth => {
            if (auth) {
                this.db.list('/members/' + auth.uid + '/notes').remove(note.key);
            }
        });
    }

    /* Save New Note/Exercise Row --- DONE */
    /* ToDo move to service */
    createNewNoteRow(noteKey, rowsCount, rowTitle) {
        this.afAuth.authState.subscribe(auth => {
            if (auth) {
                this.db.object('/members/' + auth.uid + '/notes/' + noteKey + /exercises/ + rowsCount).set({
                    'title': rowTitle,
                    'cols': this.rowCols
                });
            }
        });
    }

    /* Delete a note row --- DONE */
    /* ToDo move to service */
    deleteNoteRow(noteKey, exercise, exerciseIndex): void {
        this.afAuth.authState.subscribe(auth => {
            if (auth) {
                this.db.list('/members/' + auth.uid + '/notes/' + noteKey + '/exercises/');
            }
        });
    }

    /* Add note description */
    /* ToDo move to helper */
    newNoteDescriptionChange(ev) {
        this.newNoteTextareaValue = ev.target.value;
    }
}
