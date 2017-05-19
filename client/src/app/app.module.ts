import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule, Routes } from '@angular/router';


import { AppComponent } from './app.component';
import { LoginFormComponent } from './login-form.component'
import {Presenter} from "./presenter";
import {ProjectListComponent} from "./project-list.component";

const appRoutes: Routes = [
  { path: 'login',      component: LoginFormComponent },
  { path: 'projects',      component: ProjectListComponent }
  ];

@NgModule({
  declarations: [
    AppComponent,
    LoginFormComponent,
    ProjectListComponent
  ],
  imports: [
    RouterModule.forRoot(appRoutes),
    BrowserModule,
    FormsModule,
    HttpModule
  ],
  providers: [Presenter],
  bootstrap: [AppComponent]
})
export class AppModule { }
