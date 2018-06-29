import {Component, OnInit, HostBinding} from '@angular/core';
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

    constructor(private afAuth: AngularFireAuth, private router: Router, private db: AngularFireDatabase) {}

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
                    this.router.navigate(['/members']);
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
                this.router.navigate(['/members']);
            }).catch(
            (err) => {
                this.error = err;
            });
    }

    /* ToDo move to helper */
    private postSignIn(auth): void {
        /* Todo check to see if the account is already in the system */

        this.addNewUserAccount(auth);
        /* Todo send an email validation message */
        /* Todo if not make a new user node */
        /* Todo move this to the different login (email, facebook, google) functions? */
    }

    /* ToDo move to helper */
    private addNewUserAccount(auth): void {

        this.db.object('/members/' + auth.uid)
            .set({
                'email': auth.email,
                'displayName': auth.displayName,
            });

        const newNoteSetup = {
            'title': 'Your First Note Title',
            'exercises': {
                'cols': ['Enter', 'Some', 'Data'],
                'title': 'Your First Exercise Title'
            }
        };

        this.db.list('/members/' + auth.uid + '/notes/')
            .push(newNoteSetup);

        /* Other attempts */
        function otherStuff() {
            // this.af.database.object('/members/' + auth.uid + '/notes/0/exercises').set({
            //     'title': 'Your First Note Title'
            // });
            //
            // this.af.database.object('/members/' + auth.uid + '/notes/0/exercises/0').set({
            //     'cols': ['Enter', 'Some', 'Data'],
            //     'child_cols': ['Enter', 'Some', 'Data'],
            //     'title': 'Your First Exercise Title'
            // });
            // this.af.database.object('/members/' + auth.uid + '/notes/0/exercises/0/child_cols/0')
            //     .set(['Enter', 'Some', 'Data']);
        }
    }
}
