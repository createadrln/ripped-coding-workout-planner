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

    deleteNotebook(key: string) {
        this.afAuth.authState.subscribe(auth => {
            if (auth) {
                this.db.list('/members/' + auth.uid + '/weeks').remove(key);
            }
        });
    }
}
