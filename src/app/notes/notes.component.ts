import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {AngularFireAuth} from 'angularfire2/auth';
import {AngularFireDatabase, AngularFireList, AngularFireObject} from 'angularfire2/database';
import {Observable} from 'rxjs/Observable';

import {trigger, transition, animate, style, state} from '@angular/animations';
import {NgxSpinnerService} from 'ngx-spinner';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';

import {NotesService} from '../services/notes.service';
import {NotebooksService} from '../services/notebooks.service';
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
    workoutRowOptionsVisibilityState = 'inactive';
    hideWorkoutRowInputs = [];

    closeResult: string;

    /* ToDo Fix Loading Spinner */
    ngOnInit() {
        // this.spinner.show();
        //
        // setTimeout(() => {
        //     this.spinner.hide();
        // }, 5000);
    }

    constructor(
        private spinner: NgxSpinnerService,
        private afAuth: AngularFireAuth,
        private db: AngularFireDatabase,
        private router: Router,
        private modalService: NgbModal,
        private membersService: MembersService,
        private notesService: NotesService,
        private notebooksService: NotebooksService,
        private workoutNotebooksService: WorkoutNotebooksService
    ) {

        this.afAuth.authState.subscribe(auth => {

            if (!auth) {
                this.router.navigateByUrl('/login');
            } else {
                // this.spinner.hide();

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
                        this.weeklyWorkouts = this.notesService.getWeeklyWorkoutNotes(this.notesRef, upcomingWorkouts);
                    }
                });
            }
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

            return this.weeklyWorkouts = this.notesService.getWeeklyWorkoutNotes(this.notesRef, upcomingWorkouts);
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

        this.hideWorkoutRowInputs = [];
    }

    /* ToDo change function name to deleteNotebook and test */
    deleteNote(noteKey: string) {
        this.notebooksService.deleteNotebook(noteKey);
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

    openNewWorkoutModal(content) {
        this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
            this.closeResult = `Closed with: ${result}`;
        }, (reason) => {
            this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        });
    }

    private getDismissReason(reason: any): string {
        if (reason === ModalDismissReasons.ESC) {
            return 'by pressing ESC';
        } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
            return 'by clicking on a backdrop';
        } else {
            return  `with: ${reason}`;
        }
    }

    closeEventReceived($event) {
        this.formWorkoutNoteVisibilityState = 'inactive';
    }

    toggleWorkoutRowOptions(index) {
        this.workoutRowOptionsVisibilityState = this.workoutRowOptionsVisibilityState === 'active' ? 'inactive' : 'active';
    }
}
