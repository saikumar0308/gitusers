import { Injectable } from '@angular/core';
import { Location } from '@angular/common';
import { Http, Response, Headers, RequestOptions, URLSearchParams } from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/delay';
import { InterceptorService } from 'ng2-interceptors';
import {  Router, Route, NavigationStart,
          Event as NavigationEvent,
          NavigationCancel,
          RoutesRecognized,
          CanActivate, CanActivateChild, CanLoad,
          ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

@Injectable()
export class AuthService implements CanActivate, CanActivateChild, CanLoad {

  private code: string;
  private cachedURL: string;
  private loading: boolean;
  private loginURI: string;
  constructor(private _http: InterceptorService,private router:Router, private location: Location, public http: Http) {

    let cachedURL = localStorage.getItem('cachedurl');
    let params = new URLSearchParams(this.location.path(false).split('?')[1]);
    this.code = params.get('code');

    if(cachedURL){
      this.cachedURL = cachedURL;
    }
    if(this.code){

      this.login(this.code)
      .then((data:any) => {
          this.loading = false;
          this.router.navigate([this.cachedURL]);
              return true;
          });
    }
  }
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    let url: string = state.url;
    return this.verifyLogin(url);
  }

  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    return this.canActivate(route, state);
  }

  canLoad(route: Route): boolean {
    let url = `/${route.path}`;

    return this.verifyLogin(url);
  }

  login(code:any):Promise<any>{
    var body = {'code' : code,'clientId' : '3c423f2faef7742fd1b0','redirectUri':'http://localhost:4200/home'}
	localStorage.setItem('isLoggedIn', 'true');
	var accessTokenUrl = 'https://github.com/login/oauth/access_token';
	var userApiUrl = 'https://api.github.com/user';
	var params = {
		code: code,
		client_id: '3c423f2faef7742fd1b0',
		client_secret: '514aa1dd19370dae006ea144fc770bb41bd8e995',

	};
	var params = 'code='+ code + '&client_id=3c423f2faef7742fd1b0&client_secret=514aa1dd19370dae006ea144fc770bb41bd8e995&redirect_uri=http://localhost:4200/home';

    return this._http.post(accessTokenUrl, params)
    .toPromise()
     .then((r: Response) => {
			  console.log('hello' + r.json());
              return r.json();
      })
      .catch(this.handleError);
  }
  private handleError(error: any): Promise<any> {
    return Promise.reject(error.message || error);
  }
  logout(): void {
    localStorage.setItem('isLoggedIn', 'false');
    localStorage.removeItem('token');
    localStorage.removeItem('cachedurl');
    localStorage.removeItem('provider');
     this.router.navigate([this.loginURI]);
  }
  verifyLogin(url): boolean {

    if (!this.isLoggedIn() && this.code == null){
      localStorage.setItem('cachedurl', url);
      this.router.navigate([this.loginURI]);
      return false;
    }
    else if (this.isLoggedIn()){
      return true;
    }
    else if (!this.isLoggedIn()  && this.code != null){
       let params = new URLSearchParams(this.location.path(false).split('?')[1]);
       if (params.get('code') && (localStorage.getItem('cachedurl') == '' || localStorage.getItem('cachedurl') == undefined)){
          localStorage.setItem('cachedurl', this.location.path(false).split('?')[0]);
       }
       if (this.cachedURL != null || this.cachedURL != ''){
          this.cachedURL = localStorage.getItem('cachedurl');
       }
    }
  }
  private isLoggedIn(): boolean{
    let status = false;
    if ( localStorage.getItem('isLoggedIn') == 'true'){
      status = true;
    }
    else{
      status = false;
    }
    return status;
  }
  public auth(): void{
	window.location.href = 'https://github.com/login/oauth/authorize?scope=user:email&client_id=3c423f2faef7742fd1b0&redirect_uri=http://localhost:4200/home';
  }

}
