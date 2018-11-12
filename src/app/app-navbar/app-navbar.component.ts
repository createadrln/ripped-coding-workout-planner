import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {AngularFireAuth} from 'angularfire2/auth';

@Component({
    selector: 'app-navbar',
    templateUrl: 'app-navbar.component.html'
})

export class AppNavbarComponent implements OnInit {

    navbarOpen = false;

    constructor(
        private router: Router,
        private afAuth: AngularFireAuth
    ) {}
    ngOnInit() {}

    toggleNavbar() {
        this.navbarOpen = !this.navbarOpen;
    }

    logout() {
        this.afAuth.auth.signOut();
        this.router.navigateByUrl('/login');
        this.toggleNavbar();
    }
}
