import {Injectable} from '@angular/core';
import {MembersService} from './members.service';

@Injectable({
    providedIn: 'root'
})

export class NotesService {

    constructor(
        private memberService: MembersService
    ) {
    }

    getNotesListRef(authId) {
        return this.memberService.getMemberDbList(authId, '/notes');
    }

    getWeeklyWorkoutNotes(notesRef, upcomingWorkouts) {
        const upcomingWorkoutsVal = upcomingWorkouts.map(val => val.selected);
        return notesRef.snapshotChanges().map(notes => {
            const filtered = notes.filter(note => upcomingWorkoutsVal.includes(note.key));
            return filtered.map(c => ({key: c.payload.key, ...c.payload.val()}));
        });
    }
}
