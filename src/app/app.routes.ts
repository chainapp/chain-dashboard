import { Routes } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { NewComponent } from './new/new.component';
import { ChainComponent } from './chains/chain.component';
import { SignupComponent } from './signup/signup.component';
import { LoginComponent } from './login/login.component';
import { Angular2TokenService } from 'angular2-token';
import { AuthGuard } from './services/auth-guard.service';

export const rootRouterConfig: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full', canActivate: [AuthGuard] },
  { path: 'restricted', redirectTo: 'home', pathMatch: 'full', canActivate: [AuthGuard] },
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'new', component: NewComponent, canActivate: [AuthGuard] },
  { path: 'chains/:chainId', component: ChainComponent, canActivate: [AuthGuard]},
  { path: 'signup', component: SignupComponent},
  { path: 'login', component: LoginComponent}
];

