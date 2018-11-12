import {Component, OnInit} from '@angular/core';
import {AngularFireDatabase, AngularFireList, AngularFireObject} from "angularfire2/database";
import {Observable} from 'rxjs/Observable';
import {NgxSpinnerService} from 'ngx-spinner';
import {AngularFireAuth} from 'angularfire2/auth';
import {Router} from '@angular/router';
import {NotesService} from '../../services/notes.service';
import {ModalService} from '../../services/modal.service';

@Component({
    selector: 'app-workout-notes',
    templateUrl: './workout-notes.component.html',
    styleUrls: ['./workout-notes.component.css']
})
export class WorkoutNotesComponent implements OnInit {

    user: AngularFireObject<any>;

    notesRef: AngularFireList<any>;
    notes: Observable<any[]>;

    public searchText: string;

    constructor(
        private spinner: NgxSpinnerService,
        private afAuth: AngularFireAuth,
        private db: AngularFireDatabase,
        private router: Router,
        private notesService: NotesService,
        private modalService: ModalService,
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
            }
        });
    }

    ngOnInit() {
    }

    openLargeModal(content) {
        this.modalService.openLargeModal(content);
    }
}
