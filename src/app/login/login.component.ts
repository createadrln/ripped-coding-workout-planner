import {Component, OnInit} from '@angular/core';
import {AngularFireAuth} from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import {Router} from '@angular/router';
import {AngularFireDatabase} from 'angularfire2/database';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: []
})

export class LoginComponent implements OnInit {
    error: any;
    name: any;

    constructor(
        private afAuth: AngularFireAuth,
        private router: Router,
        private db: AngularFireDatabase
    ) {}

    ngOnInit() {}

    signInWithFacebook() {
        this.afAuth.auth
            .signInWithPopup(
                new firebase.auth.FacebookAuthProvider()
            )
            // .then(res => console.log(res));
            .then(
                (success) => {
                    this.afAuth.authState.subscribe(auth => {
                        if (auth) {
                            this.name = auth;
                            this.postSignIn(auth);
                        }
                    });
                    this.router.navigate(['/notes']);
                }).catch(
            (err) => {
                this.error = err;
            });
    }

    signInWithGoogle() {
        this.afAuth.auth
            .signInWithPopup(
                new firebase.auth.GoogleAuthProvider()
            )
            .then(
                (success) => {
                    this.afAuth.authState.subscribe(auth => {
                        if (auth) {
                            this.name = auth;
                            this.postSignIn(auth);
                        }
                    });
                    this.router.navigate(['/notes']);
                }).catch(
            (err) => {
                this.error = err;
            });
    }

    /* Todo send an email validation message */
    private postSignIn(auth): void {
        this.addNewUserAccount(auth);
    }

    private addNewUserAccount(auth): void {
        this.db.object('/members/' + auth.uid).set({
            'email': auth.email,
            'displayName': auth.displayName,
            'notes': {
                'defaultNote' : {
                    'description' : 'Chest',
                    'title' : 'Day 1 Workout',
                    'exercises' : [{
                        'reps' : '6-10',
                        'sets' : '4',
                        'title' : 'Bench Press',
                        'weight' : '185'
                    }],
                }
            },
            'weeks': {
                'defaultWeek' : {
                    'current' : true,
                    'description' : 'We Like Goals',
                    'title' : 'Default Workout Notebook',
                    'workouts' : [{
                        'selected' : 'defaultNote'
                    }]
                }
            }
        });
    }
}
