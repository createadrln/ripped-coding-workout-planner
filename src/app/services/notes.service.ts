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
}
