import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {AngularFireAuth} from 'angularfire2/auth';
import {AngularFireDatabase, AngularFireList, AngularFireObject} from 'angularfire2/database';
import {Observable} from 'rxjs/Observable';

import {trigger, transition, animate, style, state} from '@angular/animations';
import {NgxSpinnerService} from 'ngx-spinner';

import {NotesService} from '../services/notes.service';
import {NotebooksService} from '../services/notebooks.service';
import {WorkoutNotebooksService} from '../services/workout-notebooks.service';
import {MembersService} from '../services/members.service';
import {ModalService} from '../services/modal.service';

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

    hasCurrentWorkout = 'false';
    upcomingWeekTitle: string;
    upcomingWeekKey: string;
    upcomingWeekTags: any;
    upcomingWeekDescription: string;
    weeklyWorkouts: Observable<any>;

    formWorkoutNoteVisibilityState = 'inactive';
    formWorkoutNotebookVisibilityState = 'inactive';
    workoutRowOptionsVisibilityState = 'inactive';
    hideWorkoutRows = [];
    hideWorkoutRowInputs = [];

    ngOnInit() {
        // this.spinner.show();
    }

    constructor(
        private spinner: NgxSpinnerService,
        private afAuth: AngularFireAuth,
        private db: AngularFireDatabase,
        private router: Router,
        private modalService: ModalService,
        private membersService: MembersService,
        private notesService: NotesService,
        private notebooksService: NotebooksService,
        private workoutNotebooksService: WorkoutNotebooksService
    ) {

        this.afAuth.authState.subscribe(auth => {

            if (!auth) {
                this.router.navigateByUrl('/login');
            } else {
                this.spinner.hide();

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

                    if (getCurrentCollection.length > 0) {
                        const upcomingWorkouts = getCurrentCollection[0].workouts;

                        this.weeklyWorkouts = this.notesService.getWeeklyWorkoutNotes(this.notesRef, upcomingWorkouts);

                        this.hasCurrentWorkout = 'true';
                        this.upcomingWeekTitle = getCurrentCollection[0].title;
                        this.upcomingWeekKey = getCurrentCollection[0].key;
                        this.upcomingWeekTags = getCurrentCollection[0].tags;
                        this.upcomingWeekDescription = getCurrentCollection[0].description;
                    }
                });
            }
        });
    }

    /* Edit and Save a Workout Collection Note Row Action */
    saveWorkoutNoteRowUpdate(
        noteKey,
        exerciseRowIndex,
        currentTitle,
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
                    'title': currentTitle,
                    'reps': updateReps,
                    'sets': updateSets,
                    'weight': updateWeight
                });
            }
        });

        this.hideWorkoutRows = [];
        this.hideWorkoutRowInputs = [];
    }

    updatePosition() {

    }

    openLargeModal(content) {
        this.modalService.openLargeModal(content);
    }

    toggleWorkoutNotebookFormState() {
        this.formWorkoutNotebookVisibilityState = this.formWorkoutNotebookVisibilityState === 'active' ? 'inactive' : 'active';
    }

    toggleWorkoutRowOptions(index) {
        this.workoutRowOptionsVisibilityState = this.workoutRowOptionsVisibilityState === 'active' ? 'inactive' : 'active';
    }
}
