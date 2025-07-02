
import { Component, Input } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { AngularFireDatabase } from '@angular/fire/database';
@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent {
  error: any;
  name: any;

  @Input() email;
  @Input() password;

  constructor(
    private afAuth: AngularFireAuth,
    private router: Router,
    private db: AngularFireDatabase) { }

  onSubmit(formData) {
    if (formData.valid) {
      this.afAuth.createUserWithEmailAndPassword(formData.value.email, formData.value.password)
        .then(
          (success) => {
            this.afAuth.authState.subscribe(auth => {
              if (auth) {
                this.name = auth;
                this.postSignIn(auth);
              }
            });
            this.router.navigate(['/notes']);
          }
        ).catch(
          (err) => {
            this.error = err;
          }
        );
    }
  }

  /** @ToDo this is duplicate of what is in the social login component */
  /** @Todo send an email validation message */
  private postSignIn(auth): void {
    this.addNewUserAccount(auth);
  }

  /** @Todo convert this work for firestore */
  private addNewUserAccount(auth): void {
  //   this.db.object('/members/' + auth.uid).set({
  //     'email': auth.email,
  //     'notes': {
  //       'defaultNote': {
  //         'description': 'Chest',
  //         'title': 'Day 1 Workout',
  //         'exercises': [{
  //           'reps': '6-10',
  //           'sets': '4',
  //           'title': 'Bench Press',
  //           'weight': '185'
  //         }],
  //       }
  //     },
  //     'weeks': {
  //       'defaultWeek': {
  //         'current': true,
  //         'description': 'We Like Goals',
  //         'title': 'Default Workout Notebook',
  //         'workouts': [{
  //           'selected': 'defaultNote'
  //         }]
  //       }
  //     }
  //   });
  }
}
