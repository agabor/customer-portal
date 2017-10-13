import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './components/app.component';
import { LoginFormComponent } from './components/login-form.component';
import {Presenter} from './logic/presenter';
import {ProjectListComponent} from './components/project-list/project-list.component';
import {AuthGuard} from './guards/authguard';
import {DefaultApi} from '../swagger/api/DefaultApi';
import {LogoutGuard} from './guards/logoutguard';
import {ProjectComponent} from './components/project/project.component';
import {MenuComponent} from './components/menu.component';
import {ImagesComponent} from './components/project/images/images.component';
import {TextsComponent} from './components/project/texts/texts.component';
import {FilesComponent} from './components/project/files.component';
import {ImageModalComponent} from './components/project/images/image-modal.component';

import {LinksComponent} from './components/project/links/links.component';
import {Autosize} from './ui/autosize.directive';
import {FileDropDirective} from './file-drop';
import {BASE_PATH} from '../swagger/variables';
import {Configuration} from 'swagger';
import {NewImageModalComponent} from './components/project/images/new-image-modal.component';
import {ThumbnailComponent} from './components/project/images/thumbnail.component';
import {AppConfig} from 'app/app.config';
import {TokenLoginComponent} from './components/token-login.component';
import {TextModalComponent} from './components/project/texts/text-modal.component';
import {UsersComponent} from './components/project/users/users.component';
import {APP_BASE_HREF} from '@angular/common';
import {UserModalComponent} from './components/project/users/user-modal.component';
import {LinkModalComponent} from './components/project/links/link-modal.component';
import {ProjectModalComponent} from './components/project-list/project-modal.component';
import {LanguageModalComponent} from './components/project/texts/language-modal.component';
import {HomeGuard} from './guards/homeguard';
import {NewPasswordComponent} from './components/new-password.component';
import {PasswordSetGuard} from './guards/PasswordSetGuard';
import {TokenGuard} from './guards/TokenGuard';

const appRoutes: Routes = [
  { path: '',         component: LoginFormComponent, canActivate: [HomeGuard] },
  { path: 'login',    component: LoginFormComponent },
  { path: 'token/:login_token',    component: TokenLoginComponent },
  { path: 'password',    component: NewPasswordComponent, canActivate: [TokenGuard] },
  { path: 'logout',   component: LoginFormComponent, canActivate: [LogoutGuard] },
  { path: 'projects', component: ProjectListComponent, canActivate: [AuthGuard, PasswordSetGuard]},
  { path: 'projects/:slug', component: ProjectComponent, canActivate: [AuthGuard, PasswordSetGuard]},
  { path: 'projects/:slug/:part', component: ProjectComponent, canActivate: [AuthGuard, PasswordSetGuard]},
  { path: 'projects/:slug/:part/:lang', component: ProjectComponent, canActivate: [AuthGuard, PasswordSetGuard]}
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
    UserModalComponent,
    ProjectModalComponent,
    LanguageModalComponent,
    LinkModalComponent,
    ThumbnailComponent,
    NewPasswordComponent
  ],
  imports: [
    RouterModule.forRoot(appRoutes),
    BrowserModule,
    FormsModule,
    HttpModule
  ],
  providers: [Presenter, AuthGuard, LogoutGuard, DefaultApi, HomeGuard, PasswordSetGuard, TokenGuard,
    {provide: BASE_PATH, useValue: AppConfig.basePath},
    {provide: Configuration, useValue: {withCredentials: true}},
    {provide: APP_BASE_HREF, useValue : AppConfig.appBasePath }],
  bootstrap: [AppComponent, MenuComponent]
})
export class AppModule { }
