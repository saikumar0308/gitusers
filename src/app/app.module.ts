import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule, routingComponents } from './app.routing';
import { AuthService } from './login/auth.service';
import { LoginComponent } from './login/login.component';
import { AppComponent } from './app.component';
import { ServerURLInterceptor } from './interceptor';
import { InterceptorService } from 'ng2-interceptors';
import { HttpModule,XHRBackend, RequestOptions  } from '@angular/http';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home/home.component';
import {UserService} from './home/services/user.service';
import {ApiService} from './home/services/api.service';

export function interceptorFactory(xhrBackend: XHRBackend, requestOptions: RequestOptions, serverURLInterceptor:ServerURLInterceptor){ // Add it here
  let service = new InterceptorService(xhrBackend, requestOptions);
  service.addInterceptor(serverURLInterceptor); // Add it here
  return service;
}

@NgModule({
  declarations: [
    AppComponent,
	  LoginComponent,
	  HomeComponent
  ],
  imports: [
    BrowserModule,
	HttpModule,
	AppRoutingModule,
	CommonModule
  ],
    providers:[
		UserService,
		ApiService,
		XHRBackend,
        AuthService,
        ServerURLInterceptor,
        {
      provide: InterceptorService,
      useFactory: interceptorFactory,
      deps: [XHRBackend, RequestOptions, ServerURLInterceptor] }

        ],
  bootstrap: [AppComponent]
})
export class AppModule { }
