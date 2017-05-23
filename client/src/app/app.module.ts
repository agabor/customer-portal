import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule, Routes } from '@angular/router';


import { AppComponent } from './components/app.component';
import { LoginFormComponent } from './components/login-form.component'
import {Presenter} from "./presenter";
import {ProjectListComponent} from "./components/project-list.component";
import {HomeComponent} from "./components/home.component";
import {AuthGuard} from "./guards/authguard";
import {DefaultApi} from "../swagger/api/DefaultApi";
import {LogoutGuard} from "./guards/logoutguard";
import {ProjectComponent} from "./components/project.component";
import {MenuComponent} from "./components/menu.component";

const appRoutes: Routes = [
  { path: '',         redirectTo: 'home', pathMatch: 'full' },
  { path: 'home',     component: HomeComponent },
  { path: 'login',    component: LoginFormComponent },
  { path: 'logout',   component: LoginFormComponent, canActivate: [LogoutGuard] },
  { path: 'projects', component: ProjectListComponent, canActivate: [AuthGuard]},
  { path: 'projects/:slug', component: ProjectComponent, canActivate: [AuthGuard]}
  ];

@NgModule({
  declarations: [
    AppComponent,
    LoginFormComponent,
    ProjectListComponent,
    ProjectComponent,
    HomeComponent,
    MenuComponent
  ],
  imports: [
    RouterModule.forRoot(appRoutes),
    BrowserModule,
    FormsModule,
    HttpModule
  ],
  providers: [Presenter, AuthGuard, LogoutGuard, DefaultApi],
  bootstrap: [AppComponent, MenuComponent]
})
export class AppModule { }
