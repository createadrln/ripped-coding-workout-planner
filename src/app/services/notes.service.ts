import {Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';
import {MembersService} from './members.service';
import {Note} from '../classes/workout-notebook';

@Injectable({
    providedIn: 'root'
})
export class NotesService {

    constructor(
        private memberService: MembersService
    ) {
    }

    /* Get notes reference observable list */
    getNotesListRef(authId) {
        return this.memberService.getMemberDbList(authId, '/notes');
    }

    /* Get Notes */
    getNotes(notesRef): Observable<Note[]> {
        return notesRef.snapshotChanges().map(changes => {
            return changes.map(c => ({key: c.payload.key, ...c.payload.val()}));
        });
    }

}
