import {Injectable} from '@angular/core';
import {MembersService} from './members.service';

@Injectable({
    providedIn: 'root'
})
export class WorkoutNotebooksService {

    constructor(
        private memberService: MembersService
    ) {
    }

    /* Get notes reference observable list */
    getWorkoutNotebookListRef(authId) {
        return this.memberService.getMemberDbList(authId, '/weeks');
    }

    /* Remove existing week toggle data */
    removeCurrentWeekToggleData(authId, weeklyWorkoutCollections) {
        weeklyWorkoutCollections.subscribe(weeks => {
            const oldCurrentWeek = weeks.filter(week => week.current);
            return this.memberService.getMemberDbList(authId, '/weeks/' + oldCurrentWeek[0].key).remove('current');
        });
    }
}
