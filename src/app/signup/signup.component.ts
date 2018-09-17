import {Component, Input, OnInit} from '@angular/core';
import {AngularFireAuth} from 'angularfire2/auth';
import {Router} from '@angular/router';
import {AngularFireDatabase} from 'angularfire2/database';

// import {moveIn, fallIn} from '../router.animations';

@Component({
    selector: 'app-signup',
    templateUrl: './signup.component.html',
    // animations: [moveIn(), fallIn()],
})

export class SignupComponent implements OnInit {

    error: any;
    name: any;

    @Input() email;
    @Input() password;

    ngOnInit() {
    }

    constructor(private afAuth: AngularFireAuth, private router: Router, private db: AngularFireDatabase) {
    }

    onSubmit(formData) {
        if (formData.valid) {
            this.afAuth.auth.createUserWithEmailAndPassword(formData.value.email, formData.value.password)
                .then(
                    (success) => {
                        this.afAuth.authState.subscribe(auth => {
                            if (auth) {
                                this.name = auth;
                                this.postSignIn(auth);
                            }
                        });
                        this.router.navigate(['/members']);
                    }
                ).catch(
                (err) => {
                    this.error = err;
                }
            );
        }
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

        /* Todo change programs to use service */
        this.db.object('/members/' + auth.uid)
            .set({
                'email': this.name.auth.email,
                'displayName': this.name.auth.displayName,
            });

        const newNoteSetup = {
            'title': 'Your First Note Title',
            'exercises': {
                'cols': ['Enter', 'Some', 'Data'],
                'title': 'Your First Exercise Title'
            }
        };

        /* ToDo move to helper */
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
