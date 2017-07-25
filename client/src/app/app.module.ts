import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './components/app.component';
import { LoginFormComponent } from './components/login-form.component';
import {Presenter} from './logic/presenter';
import {ProjectListComponent} from './components/project-list.component';
import {HomeComponent} from './components/home.component';
import {AuthGuard} from './guards/authguard';
import {DefaultApi} from '../swagger/api/DefaultApi';
import {LogoutGuard} from './guards/logoutguard';
import {ProjectComponent} from './components/project/project.component';
import {MenuComponent} from './components/menu.component';
import {ImagesComponent} from './components/project/images/images.component';
import {TextsComponent} from './components/project/texts.component';
import {FilesComponent} from './components/project/files.component';
import {ImageModalComponent} from './components/project/images/image-modal.component';

import {VideosComponent} from './components/project/videos.component';
import {LinksComponent} from './components/project/links.component';
import {Autosize} from './ui/autosize.directive';
import {FileDropDirective} from './file-drop';
import {BASE_PATH} from '../swagger/variables';
import {Configuration} from 'swagger';
import {NewImageModalComponent} from './components/project/images/new-image-modal.component';
import {ThumbnailComponent} from './components/project/images/thumbnail.component';

const appRoutes: Routes = [
  { path: '',         redirectTo: 'home', pathMatch: 'full' },
  { path: 'pricing',     component: HomeComponent },
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
    MenuComponent,
    ImagesComponent,
    TextsComponent,
    FilesComponent,
    ImageModalComponent,
    VideosComponent,
    LinksComponent,
    Autosize,
    FileDropDirective,
    NewImageModalComponent,
    ThumbnailComponent
  ],
  imports: [
    RouterModule.forRoot(appRoutes),
    BrowserModule,
    FormsModule,
    HttpModule
  ],
  providers: [Presenter, AuthGuard, LogoutGuard, DefaultApi, {provide: BASE_PATH, useValue: 'http://localhost:8000/api/v1'}, Configuration],
  bootstrap: [AppComponent, MenuComponent]
})
export class AppModule { }
