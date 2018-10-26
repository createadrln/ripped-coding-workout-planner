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
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-workout-notebooks',
    templateUrl: './workout-notebooks.component.html'
})

export class WorkoutNotebooksComponent implements OnInit {

    notesRef: AngularFireList<any>;
    notes: Observable<any[]>;

    workoutNotebooksRef: AngularFireList<any>;
    workoutNotebooks: Observable<any[]>;

    deleteWorkoutAlert = 'inactive';
    hideWorkoutExercises = [];

    constructor(
        private spinner: NgxSpinnerService,
        private afAuth: AngularFireAuth,
        private db: AngularFireDatabase,
        private router: Router,
        private membersService: MembersService,
        private notesService: NotesService,
        private notebooksService: NotebooksService,
        private workoutNotebooksService: WorkoutNotebooksService,
        private modalService: NgbModal
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
                this.workoutNotebooksRef = this.workoutNotebooksService.getWorkoutNotebookListRef(auth.uid);
                this.workoutNotebooks = this.workoutNotebooksRef.snapshotChanges().map(changes => {
                    return changes.map(c => ({key: c.payload.key, ...c.payload.val()}));
                });

                /* Get Workouts From Observable */
                this.workoutNotebooks.subscribe(notebook => {
                    const workouts = notebook[0].workouts;
                });
            }

            this.hideWorkoutExercises = [];
        });
    }

    ngOnInit() {
    }

    deleteNotebook(key: string) {
        this.notebooksService.deleteNotebook(key);
        this.deleteWorkoutAlert = 'inactive';
    }

    removeWorkoutFromNotebook(notebookKey: string, noteKey: string, index: number) {
        this.notebooksService.deleteNotebook(noteKey);
        this.afAuth.authState.subscribe(auth => {
            if (auth) {
                /* ToDo add 'are you sure you want to do this' message */
                this.db.list('/members/' + auth.uid + '/notes').remove(noteKey);
            }
        });
    }

    toggleDeleteWorkoutAlert(index) {
        this.deleteWorkoutAlert = this.deleteWorkoutAlert === 'active' ? 'inactive' : 'active';
    }

    openNewWorkoutModal(content) {
        this.modalService.open(content, {
            size: 'lg',
            centered: true
        });
    }
}
