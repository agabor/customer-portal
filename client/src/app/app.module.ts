import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './components/app.component';
import { LoginFormComponent } from './components/login-form.component';
import {Presenter} from './logic/presenter';
import {ProjectListComponent} from './components/project-list.component';
import {AuthGuard} from './guards/authguard';
import {DefaultApi} from '../swagger/api/DefaultApi';
import {LogoutGuard} from './guards/logoutguard';
import {ProjectComponent} from './components/project/project.component';
import {MenuComponent} from './components/menu.component';
import {ImagesComponent} from './components/project/images/images.component';
import {TextsComponent} from './components/project/texts/texts.component';
import {FilesComponent} from './components/project/files.component';
import {ImageModalComponent} from './components/project/images/image-modal.component';

import {LinksComponent} from './components/project/links.component';
import {Autosize} from './ui/autosize.directive';
import {FileDropDirective} from './file-drop';
import {BASE_PATH} from '../swagger/variables';
import {Configuration} from 'swagger';
import {NewImageModalComponent} from './components/project/images/new-image-modal.component';
import {ThumbnailComponent} from './components/project/images/thumbnail.component';
import {AppConfig} from 'app/app.config';
import {TokenLoginComponent} from './components/token-login.component';
import {TextModalComponent} from './components/project/texts/text-modal.component';
import {UsersComponent} from './components/project/users.component';

const appRoutes: Routes = [
  { path: '',         redirectTo: 'home', pathMatch: 'full' },
  { path: 'login',    component: LoginFormComponent },
  { path: 'token/:login_token',    component: TokenLoginComponent },
  { path: 'logout',   component: LoginFormComponent, canActivate: [LogoutGuard] },
  { path: 'projects', component: ProjectListComponent, canActivate: [AuthGuard]},
  { path: 'projects/:slug', component: ProjectComponent, canActivate: [AuthGuard]},
  { path: 'projects/:slug/:part', component: ProjectComponent, canActivate: [AuthGuard]},
  { path: 'projects/:slug/:part/:lang', component: ProjectComponent, canActivate: [AuthGuard]}
  ];

@NgModule({
  declarations: [
    AppComponent,
    LoginFormComponent,
    TokenLoginComponent,
    ProjectListComponent,
    ProjectComponent,
    MenuComponent,
    ImagesComponent,
    TextsComponent,
    FilesComponent,
    UsersComponent,
    ImageModalComponent,
    LinksComponent,
    Autosize,
    FileDropDirective,
    NewImageModalComponent,
    TextModalComponent,
    ThumbnailComponent
  ],
  imports: [
    RouterModule.forRoot(appRoutes),
    BrowserModule,
    FormsModule,
    HttpModule
  ],
  providers: [Presenter, AuthGuard, LogoutGuard, DefaultApi,
    {provide: BASE_PATH, useValue: AppConfig.basePath}, {provide: Configuration, useValue: {withCredentials: true}}],
  bootstrap: [AppComponent, MenuComponent]
})
export class AppModule { }
