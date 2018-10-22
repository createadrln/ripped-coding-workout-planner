import {Component, OnInit} from '@angular/core';
import {AngularFireAuth} from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import {Router} from '@angular/router';
import {AngularFireDatabase} from 'angularfire2/database';
import {ModalDismissReasons, NgbModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: []
})

export class LoginComponent implements OnInit {
    error: any;
    name: any;
    date = new Date();

    closeResult: string;

    constructor(
        private afAuth: AngularFireAuth,
        private router: Router,
        private db: AngularFireDatabase,
        private modalService: NgbModal
    ) {}

    ngOnInit() {}

    signInWithFacebook() {
        this.afAuth.auth
            .signInWithPopup(new firebase.auth.FacebookAuthProvider())
            .then(
                (success) => {
                    this.afAuth.authState.subscribe(auth => {
                        if (auth) {
                            if (new Date(auth.metadata.creationTime) === new Date(auth.metadata.lastSignInTime)) {
                                this.postSignIn(auth);
                                this.name = auth;
                            }

                            setTimeout(() => {
                                this.router.navigate(['/current']);
                            }, 5000);
                        }
                    });
                }).catch(
            (err) => {
                this.error = err;
            });
    }

    signInWithGoogle() {
        this.afAuth.auth
            .signInWithPopup(new firebase.auth.GoogleAuthProvider())
            .then(
                (success) => {
                    this.afAuth.authState.subscribe(auth => {
                        if (auth) {
                            const accountCreationTime = new Date(auth.metadata.creationTime);
                            const accountLastLoginTime = new Date(auth.metadata.lastSignInTime);

                            if (accountCreationTime.getTime() === accountLastLoginTime.getTime()) {
                                this.postSignIn(auth);
                                this.name = auth;
                            }

                            setTimeout(() => {
                                this.router.navigate(['/current']);
                            }, 2000);
                        }
                    });
                }).catch(
            (err) => {
                this.error = err;
            });
    }

    /* ToDo send an email validation message or something */
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

    openModal(content) {
        this.modalService.open(content, {
            centered: true
        });
    }
}
