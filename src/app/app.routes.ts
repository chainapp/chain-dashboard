import { Routes } from '@angular/router';

import { AboutComponent } from './about/about.component';
import { HomeComponent } from './home/home.component';
import { NewComponent } from './new/new.component';
import { ChainComponent } from './chains/chain.component';
import { RepoBrowserComponent } from './github/repo-browser/repo-browser.component';
import { RepoListComponent } from './github/repo-list/repo-list.component';
import { RepoDetailComponent } from './github/repo-detail/repo-detail.component';
import { ContactComponent } from './contact/contact.component';
import { Angular2TokenService } from 'angular2-token';

export const rootRouterConfig: Routes = [
  { path: 'restricted', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent, canActivate: [Angular2TokenService] },
  { path: 'new', component: NewComponent, canActivate: [Angular2TokenService] },
  { path: 'about', component: AboutComponent },
  { path: 'chains/:chainId', component: ChainComponent},
  { path: 'github', component: RepoBrowserComponent,
    children: [
      { path: '', component: RepoListComponent },
      { path: ':org', component: RepoListComponent,
        children: [
          { path: '', component: RepoDetailComponent },
          { path: ':repo', component: RepoDetailComponent }
        ]
      }]
  },
  { path: 'contact', component: ContactComponent }
];

