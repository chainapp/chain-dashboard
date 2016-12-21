import {Component} from '@angular/core';
import { Angular2TokenService } from 'angular2-token';

@Component({
  selector: 'app',
  templateUrl: './app.component.html',
})
export class AppComponent {
	constructor(private _tokenService: Angular2TokenService) {
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
	}
}
