import {Injectable} from '@angular/core';
import {AngularFireAuth} from 'angularfire2/auth';
import {AngularFireDatabase} from 'angularfire2/database';

@Injectable({
    providedIn: 'root'
})

export class NotebooksService {

    constructor(
        private afAuth: AngularFireAuth,
        private db: AngularFireDatabase
    ) {
    }

    deleteNotebook(noteKey: string) {
        this.afAuth.authState.subscribe(auth => {
            if (auth) {
                /* ToDo add 'are you sure you want to do this' message */
                this.db.list('/members/' + auth.uid + '/notes').remove(noteKey);
            }
        });
    }
}
