import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';

@Component({
    selector: 'app-navbar',
    templateUrl: 'app-navbar.component.html'
})

export class AppNavbarComponent implements OnInit {

    navbarOpen = false;

    constructor(private router: Router) {}
    ngOnInit() {}

    toggleNavbar() {
        this.navbarOpen = !this.navbarOpen;
    }
}
