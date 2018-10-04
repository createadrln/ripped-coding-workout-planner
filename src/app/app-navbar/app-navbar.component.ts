import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: 'app-navbar.component.html',
  styleUrls: []
})
export class AppNavbarComponent implements OnInit {

  constructor(private router: Router) {}
  ngOnInit() {}

  goToUserSettings() {
      this.router.navigateByUrl('/settings');
  }
}
