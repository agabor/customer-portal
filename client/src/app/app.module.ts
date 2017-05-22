import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule, Routes } from '@angular/router';


import { AppComponent } from './app.component';
import { LoginFormComponent } from './login-form.component'
import {Presenter} from "./presenter";
import {ProjectListComponent} from "./project-list.component";
import {HomeComponent} from "./home.component";
import {AuthGuard} from "./guards/authguard";
import {DefaultApi} from "../swagger/api/DefaultApi";
import {LogoutGuard} from "./guards/logoutguard";

const appRoutes: Routes = [
  { path: '',         component: HomeComponent },
  { path: 'login',    component: LoginFormComponent },
  { path: 'logout',    component: LoginFormComponent, canActivate: [LogoutGuard] },
  { path: 'projects', component: ProjectListComponent, canActivate: [AuthGuard]}
  ];

@NgModule({
  declarations: [
    AppComponent,
    LoginFormComponent,
    ProjectListComponent,
    HomeComponent
  ],
  imports: [
    RouterModule.forRoot(appRoutes),
    BrowserModule,
    FormsModule,
    HttpModule
  ],
  providers: [Presenter, AuthGuard, LogoutGuard, DefaultApi],
  bootstrap: [AppComponent]
})
export class AppModule { }
