import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { AuthService } from './login/auth.service';

 const routes: Routes = [
   { path: '', component: LoginComponent },
   { path: 'login', component: LoginComponent },
  { path: 'home', component: HomeComponent, canActivate: [AuthService] },

 ];

 @NgModule({
   imports: [RouterModule.forRoot(routes)],
   exports: [RouterModule],
 })
 export class AppRoutingModule { }

 export const routingComponents = [LoginComponent, HomeComponent];
