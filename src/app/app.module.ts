import { NgModule, Injectable } from '@angular/core'
import { RouterModule, CanActivate } from '@angular/router';
import { rootRouterConfig } from './app.routes';
import { AppComponent } from './app.component';
import { ChainService } from './services/chain.service';
import { AuthService } from './services/auth.service';
import { AuthGuard } from './services/auth-guard.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';

import { HomeComponent } from './home/home.component';
import { ChainComponent } from './chains/chain.component';
import { NewComponent } from './new/new.component';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';
import { SignupComponent } from './signup/signup.component';
import { LoginComponent } from './login/login.component';

import {ImageCropperComponent, CropperSettings} from 'ng2-img-cropper';

import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

import { ModalModule } from 'angular2-modal';
import { BootstrapModalModule } from 'angular2-modal/plugins/bootstrap';
import {ToasterModule, ToasterService} from 'angular2-toaster/angular2-toaster';
import {PopoverModule} from "ng2-popover";
import { UiSwitchModule } from 'angular2-ui-switch'

import { Angular2TokenService, A2tUiModule } from 'angular2-token';

import {FacebookService, FacebookLoginResponse} from 'ng2-facebook-sdk';


@NgModule({
  declarations: [
    AppComponent,
    ChainComponent,
    HomeComponent,
    ImageCropperComponent,
    LoginComponent,
    NewComponent,
    SignupComponent
  ],
  imports: [
    NgbModule.forRoot(),
    A2tUiModule,
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    RouterModule.forRoot(rootRouterConfig, { useHash: true }),
    ModalModule.forRoot(),
    BootstrapModalModule,
    ToasterModule,
    PopoverModule,
    UiSwitchModule
  ],
  providers: [
    Angular2TokenService,
    FacebookService,
    ChainService,
    AuthService,
    AuthGuard 
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule {

}
