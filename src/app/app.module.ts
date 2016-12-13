import { NgModule } from '@angular/core'
import { RouterModule } from '@angular/router';
import { rootRouterConfig } from './app.routes';
import { AppComponent } from './app.component';
import { GithubService } from './github/shared/github.service';
import { ChainService } from './services/chain.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';

import { AboutComponent } from './about/about.component';
import { HomeComponent } from './home/home.component';
import { ChainComponent } from './chains/chain.component';
import { NewComponent } from './new/new.component';
import { RepoBrowserComponent } from './github/repo-browser/repo-browser.component';
import { RepoListComponent } from './github/repo-list/repo-list.component';
import { RepoDetailComponent } from './github/repo-detail/repo-detail.component';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';
import { ContactComponent } from './contact/contact.component';



import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

import { ModalModule } from 'angular2-modal';
import { BootstrapModalModule } from 'angular2-modal/plugins/bootstrap';
import {ToasterModule, ToasterService} from 'angular2-toaster/angular2-toaster';
import {PopoverModule} from "ng2-popover";
import { UiSwitchModule } from 'angular2-ui-switch'

@NgModule({
  declarations: [
    AppComponent,
    AboutComponent,
    RepoBrowserComponent,
    RepoListComponent,
    RepoDetailComponent,
    HomeComponent,
    ContactComponent,
    NewComponent,
    ChainComponent
  ],
  imports: [
    NgbModule.forRoot(),
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
    GithubService,
    ChainService 
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule {

}
