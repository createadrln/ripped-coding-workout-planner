import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';

import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { WorkoutsService } from '../../../_services/workouts.service';
import { ModalService } from '../../../_services/modal.service';

@Component({
  selector: 'app-notebooks',
  templateUrl: './notebooks.component.html',
  styleUrls: ['./notebooks.component.scss']
})

export class NotebooksComponent {
  notesRef: AngularFireList<any>;
  notes: Observable<any[]>;

  workoutNotebooksRef: AngularFireList<any>;
  workoutNotebooks: Observable<any[]>;

  current: boolean;

  hideWorkoutExercises = [];

  public searchText: string;

  constructor(
    private afAuth: AngularFireAuth,
    private db: AngularFireDatabase,
    private router: Router,
    private workoutsService: WorkoutsService,
    private modalService: ModalService,
  ) {
    this.afAuth.authState.subscribe(auth => {

      if (!auth) {
        this.router.navigateByUrl('/login');
      } else {

        /* Workout Note Observables */
        this.notesRef = this.workoutsService.getNotesListRef(auth.uid);
        this.notes = this.notesRef.snapshotChanges().pipe(map(changes => {
          return changes.map(c => ({ key: c.payload.key, ...c.payload.val() }));
        }));

        /* Workout Collection Observables */
        this.workoutNotebooksRef = this.db.list('/members/' + auth.uid + '/weeks/', notebooks => {
          return notebooks.orderByChild('current');
        });

        this.workoutNotebooks = this.workoutNotebooksRef.snapshotChanges().pipe(map(changes => {
          return changes.map(c => ({ key: c.payload.key, ...c.payload.val() }));
        }));
      }

      this.hideWorkoutExercises = [];
    });
  }

  deleteNotebook(key: string) {
    this.workoutsService.deleteNotebook(key);
    this.modalService.dismissAllModals();
  }

  setCurrentWorkout(key: string) {
    this.afAuth.authState.subscribe(auth => {
      this.workoutsService.removeCurrentWeekToggleData(auth.uid, this.workoutNotebooks);
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
