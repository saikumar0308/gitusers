import { Component } from '@angular/core';
import { AuthService } from './auth.service';

@Component({
  styleUrls: ['./login.component.css'],
  template: `<div class="container">
    <div class="row">

    <div class="col-sm-4 col-sm-offset-4 social-buttons">
      <a class="btn btn-block btn-social btn-github" (click)="githubLogin()">
            <span class="fa fa-github"></span> Sign in with GitHub
          </a>
          </div></div></div>`
})
export class LoginComponent {
  constructor(public authService: AuthService) {
	  // console.log(this.authService.isLoggedIn());
  }

  githubLogin() {
    this.authService.auth();
  }
}
