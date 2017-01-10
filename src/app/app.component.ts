import {Component, ViewContainerRef, Output, EventEmitter} from '@angular/core';
import { Angular2TokenService } from 'angular2-token';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';
import {PopoverModule} from "ng2-popover";

@Component({
  selector: 'app',
  templateUrl: './app.component.html',
})
export class AppComponent {
	loggedIn: boolean = false;
	searchstring: any = null;
	@Output() search: EventEmitter<any> = new EventEmitter();
	constructor(private router: Router, private _tokenService: Angular2TokenService, private authService: AuthService) {
	    this._tokenService.init({
	        apiPath:                    'https://backend.wechain.eu/',

	        signInPath:                 'auth/dashboard/login',
	        signInRedirect:             '/home',
	        signInStoredUrlStorageKey:  null,

	        signOutPath:                'auth/dashboard/logout',
	        validateTokenPath:          'dashboard/auth/validate',
	        signOutFailedValidate:      false,

	        registerAccountPath:        'auth/dashboard/signup',
	        deleteAccountPath:          'auth',
	        registerAccountCallback:    window.location.href,

	        updatePasswordPath:         'auth',
	        resetPasswordPath:          'auth/password',
	        resetPasswordCallback:      window.location.href,

	        oAuthPaths: {
	            github:                 'auth/github'
	        },
	        oAuthCallbackPath:          'oauth_callback',
	        oAuthWindowType:            'newWindow',

	        userTypes:                  null,

	        globalOptions: {
	            headers: {
	                'Content-Type':     'application/json',
	                'Accept':           'application/json'
	            }
	        }
	    });
	    this.loggedIn = authService.isLoggedIn();
	}

	emit(){
		this.search.emit(this.searchstring);
		console.log("emitting "+this.searchstring)
	}

	logout(){
		this.authService.logout();
		this.router.navigate(['/login']);
		
	}


}
