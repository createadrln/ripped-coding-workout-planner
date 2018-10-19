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

    closeResult: string;

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
        });
    }

    ngOnInit() {
    }

    deleteNotebook(noteKey: string) {
        this.notebooksService.deleteNotebook(noteKey);
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
}
