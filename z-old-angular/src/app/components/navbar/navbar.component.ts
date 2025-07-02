import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  navbarOpen = false;

  constructor(
    private router: Router,
    private afAuth: AngularFireAuth
  ) { }

  ngOnInit() { }

  toggleNavbar() {
    this.navbarOpen = !this.navbarOpen;
  }

  logout() {
    this.afAuth.signOut();
    this.router.navigateByUrl('/login');
    this.toggleNavbar();
  }
}
