import {Component, OnInit} from '@angular/core';
import {NgxSpinnerService} from 'ngx-spinner';
import {AngularFireAuth} from 'angularfire2/auth';
import {AngularFireDatabase, AngularFireList} from 'angularfire2/database';
import {Router} from '@angular/router';
import {Observable} from 'rxjs/Observable';

import {MembersService} from '../../services/members.service';
import {NotesService} from '../../services/notes.service';
import {NotebooksService} from '../../services/notebooks.service';
import {WorkoutNotebooksService} from '../../services/workout-notebooks.service';
import {ModalService} from '../../services/modal.service';

@Component({
    selector: 'app-workout-notebooks',
    templateUrl: './workout-notebooks.component.html'
})

export class WorkoutNotebooksComponent implements OnInit {

    notesRef: AngularFireList<any>;
    notes: Observable<any[]>;

    workoutNotebooksRef: AngularFireList<any>;
    workoutNotebooks: Observable<any[]>;

    current: boolean;

    hideWorkoutExercises = [];

    public searchText: string;

    constructor(
        private spinner: NgxSpinnerService,
        private afAuth: AngularFireAuth,
        private db: AngularFireDatabase,
        private router: Router,
        private membersService: MembersService,
        private notesService: NotesService,
        private notebooksService: NotebooksService,
        private workoutNotebooksService: WorkoutNotebooksService,
        private modalService: ModalService
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
                this.workoutNotebooksRef = this.db.list('/members/' + auth.uid + '/weeks/', notebooks => {
                    return notebooks.orderByChild('current');
                });
                this.workoutNotebooks = this.workoutNotebooksRef.snapshotChanges().map(changes => {
                    return changes.map(c => ({key: c.payload.key, ...c.payload.val()}));
                });
            }

            this.hideWorkoutExercises = [];
        });
    }

    ngOnInit() {
    }

    deleteNotebook(key: string) {
        this.notebooksService.deleteNotebook(key);
        this.modalService.dismissAllModals();
    }

    setCurrentWorkout(key: string) {
        this.afAuth.authState.subscribe(auth => {
            this.workoutNotebooksService.removeCurrentWeekToggleData(auth.uid, this.workoutNotebooks);
            this.db.object('/members/' + auth.uid + '/weeks/' + key).update({
                'current': true
            });
        });
        this.modalService.dismissAllModals();
    }

    openLargeModal(content) {
        this.modalService.openLargeModal(content);
    }

    openWarningModal(content) {
        this.modalService.openWarningModal(content);
    }
}
