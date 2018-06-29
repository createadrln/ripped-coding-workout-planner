import {Component, Input, OnInit} from '@angular/core';
import {AngularFireAuth} from 'angularfire2/auth';
import {Router} from '@angular/router';

@Component({
    selector: 'app-email',
    templateUrl: './email.component.html',
    styleUrls: [],
    // animations: [],
})

export class EmailComponent implements OnInit {

    error: any;

    @Input() email;
    @Input() password;

    constructor(private afAuth: AngularFireAuth, private router: Router) {
        this.afAuth.authState.subscribe(auth => {
            if (auth) {
                this.router.navigateByUrl('/members');
            }
        });
    }

    onSubmit(formData) {
        if (formData.valid) {
            this.afAuth.auth.signInWithEmailAndPassword(formData.value.email, formData.value.password)
                .then(
                    (success) => {
                        this.router.navigate(['/members']);
                    }
                ).catch(function (error) {
                    // Handle Errors here.
                    const errorCode = error.code;
                    const errorMessage = error.message;
                    if (errorCode === 'auth/wrong-password') {
                        alert('Wrong password.');
                    } else {
                        alert(errorMessage);
                    }
                    console.log(error);
                }
            );
        }
    }

    ngOnInit() {
    }

}
