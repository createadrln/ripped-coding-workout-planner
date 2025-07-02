import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireDatabase } from '@angular/fire/database';
import { MembersService } from './members.service';
@Injectable({
  providedIn: 'root'
})
export class WorkoutsService {

  constructor(
    private afAuth: AngularFireAuth,
    private db: AngularFireDatabase,
    private memberService: MembersService
  ) {
  }

  deleteNotebook(key: string) {
    this.afAuth.authState.subscribe(auth => {
      if (auth) {
        this.db.list('/members/' + auth.uid + '/weeks').remove(key);
      }
    });
  }

  getNotesListRef(authId) {
    return this.memberService.getMemberDbList(authId, '/notes');
  }

  getWeeklyWorkoutNotes(notesRef, upcomingWorkouts) {
    const upcomingWorkoutsVal = upcomingWorkouts.map(val => val.selected);
    return notesRef.snapshotChanges().map(notes => {
      const filtered = notes.filter(note => upcomingWorkoutsVal.includes(note.key));
      return filtered.map(c => ({ key: c.payload.key, ...c.payload.val() }));
    });
  }

  getWorkoutNotebookListRef(authId) {
    return this.memberService.getMemberDbList(authId, '/weeks');
  }

  removeCurrentWeekToggleData(authId, weeklyWorkoutCollections) {
    weeklyWorkoutCollections.subscribe(weeks => {
      const oldCurrentWeek = weeks.filter(week => week.current);
      return this.memberService.getMemberDbList(authId, '/weeks/' + oldCurrentWeek[0].key).remove('current');
    });
  }
}
