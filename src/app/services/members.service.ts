import {Injectable} from '@angular/core';
import {AngularFireDatabase} from 'angularfire2/database';

@Injectable({
    providedIn: 'root'
})
export class MembersService {

    constructor(
        private db: AngularFireDatabase
    ) {
    }

    /* Gets Firebase List */

    getMemberDbList(auth, path) {
        if (path) {
            return this.db.list('/members/' + auth + path);
        } else {
            return this.db.list('/members/' + auth);
        }
    }

    /* Gets Firebase Object */

    getMemberDbObject(auth, path) {
        if (path) {
            return this.db.object('/members/' + auth + path);
        } else {
            return this.db.object('/members/' + auth);
        }
    }
}
