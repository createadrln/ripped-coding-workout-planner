import { Component, HostBinding } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase/app';
import { Router } from '@angular/router';
import { AngularFireDatabase } from '@angular/fire/database';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  @HostBinding('class') class = 'h-100 d-flex flex-column';

  error: any;
  name: any;
  date = new Date();

  closeResult: string;

  constructor(
    private afAuth: AngularFireAuth,
    private router: Router,
    private db: AngularFireDatabase,
    private modalService: NgbModal
  ) { }

  signInWithFacebook() {
    this.afAuth
      .signInWithPopup(new firebase.auth.FacebookAuthProvider())
      .then(
        () => {
          this.afAuth.authState.subscribe(auth => {
            if (auth) {
              this.router.navigate(['/notebooks']);
            }
          });
        }).catch(
          (err) => {
            this.error = err;
          });
  }

  signInWithGoogle() {
    this.afAuth
      .signInWithPopup(new firebase.auth.GoogleAuthProvider())
      .then(
        () => {
          this.afAuth.authState.subscribe(auth => {
            if (auth) {
              this.router.navigate(['/notebooks']);
            }
          });
        }).catch(
          (err) => {
            this.error = err;
          });
  }

  /* @ToDo send an email validation message or something */
  // private postSignIn(auth): void {
  //   this.addNewUserAccount(auth);
  // }

  openModal(content) {
    this.modalService.open(content, {
      centered: true
    });
  }

}
