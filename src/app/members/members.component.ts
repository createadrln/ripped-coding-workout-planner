import {Component, OnInit, HostBinding} from '@angular/core';
import {AngularFireAuth} from 'angularfire2/auth';
import {Router} from '@angular/router';

@Component({
    selector: 'app-members',
    templateUrl: './members.component.html',
    styleUrls: [],
    animations: [],
    // host: {}
})

export class MembersComponent implements OnInit {

    // email: AngularFireList<Member[]> = null;
    name: any;
    email: any;
    uid: any;

    constructor(private afAuth: AngularFireAuth, private router: Router) {

        this.afAuth.authState.subscribe((auth) => {
            this.email = auth.email;
            this.name = auth.displayName;
            this.uid = auth.uid;
        });
    }

    logout() {
        this.afAuth.auth.signOut();
        this.router.navigateByUrl('/login');
    }

    ngOnInit() {
    }
}
