import { Component, OnInit, HostBinding } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: []
})

export class LoginComponent implements OnInit {
  error: any;
  name: any;

  constructor(private afAuth: AngularFireAuth, private router: Router) {}

  signInWithFacebook() {
    this.afAuth.auth
      .signInWithPopup(
        new firebase.auth.FacebookAuthProvider()
      )
      .then(
        // res => console.log(res)
        (success) => {
          this.router.navigate(['/member']);
        }).catch(
      (err) => {
        this.error = err;
      });
  }
  ngOnInit() {
  }

}
