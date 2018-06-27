import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireList, AngularFireObject, AngularFireDatabase } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
import { WorkoutNote } from '../classes/workout-notes';

@Injectable()
export class WorkoutNotesService {

    private afAuth: AngularFireAuth;
    // private basePath: string = '/items';

    workoutNotes: AngularFireList<WorkoutNote[]> = null;
    workoutNote: AngularFireObject<WorkoutNote> = null;

    constructor(private db: AngularFireDatabase) {}

    // getItemsList(query = {}): AngularFireList<WorkoutNote[]> {
    //     this.workoutNotes = this.db.list(this.basePath, {
    //         query: query
    //     });
    //     return this.workoutNotes;
    // }
    //

    // getWeeksWorkouts(): AngularFireList<WorkoutNote[]> {
    //     this.afAuth.authState.subscribe(auth => {
    //         if (auth) {
    //             return this.db.list('/members/' + auth.uid + '/weeks', ref => {
    //                 ref.orderByChild('key');
    //             });
    //         }
    //     });
    // }

    //
    // getItemsList(): Observable<WorkoutNote[]> {
    //     return this.db.list('/messages', ref => {
    //         let q = ref.limitTolast(25).orderByKey(true);
    //         return q;
    //     });
    // }
}
