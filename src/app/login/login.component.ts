import { Component, ViewChild  } from '@angular/core';
import { Router } from '@angular/router';
import { ChainService } from '../services/chain.service';
import { AuthService } from '../services/auth.service';
import {ImageCropperComponent, CropperSettings} from 'ng2-img-cropper';
import {FacebookService, FacebookLoginResponse} from 'ng2-facebook-sdk';
import { Angular2TokenService, A2tUiModule } from 'angular2-token';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import {ToasterContainerComponent, ToasterService} from 'angular2-toaster/angular2-toaster';
declare const FB:any;

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [FacebookService]
})
export class LoginComponent {
	post : FormGroup = new FormGroup({
	   email: new FormControl('',Validators.required),
	   password: new FormControl('',Validators.required)
	});
	private toasterService: ToasterService;

	constructor(private router: Router, private _tokenService: Angular2TokenService, fb: FormBuilder, private authService: AuthService, toasterService: ToasterService) {
	    this._tokenService.init();
	    this.toasterService = toasterService; 
	     FB.init({
            appId      : '1439505569702173',
            cookie     : false,  // enable cookies to allow the server to access
                                // the session
            xfbml      : true,  // parse social plugins on this page
            version    : 'v2.5' // use graph api version 2.5
        });
	}

	ngOnInit() {
		FB.getLoginStatus(response => {
            this.statusChangeCallback(response);
        });
	    if (this.authService.isLoggedIn()){
	    	console.log("user already logged in")
	    	this.router.navigate(['/home']);
	    }else{
	    	console.log("user not already logged in")
	    }
	 }

	login(data){
		this.authService.login(data).subscribe(
	        res => {
	          console.log(res);
	          console.log(this.authService.isLoggedIn());
	          this.toasterService.pop('success', 'Login successful', 'Hello '+res.username+', welcome back on WeChain !');
	          this.router.navigate(['/home']);
	        },
	        err => {
	        	var message = JSON.parse(err._body).message
	            this.toasterService.pop('error', 'Error', 'Error occured during login process: '+message);
	        }
	    );
		//this.authService.valid();
	}

    onFacebookLoginClick() {
        FB.login();
    }

    statusChangeCallback(resp) {
        if (resp.status === 'connected') {
            this.authService.fbLogin(resp.authResponse.accessToken).subscribe(
		        res => {
		          console.log("after fbLogin from service auth")
		          console.log(res);
		          console.log(this.authService.isLoggedIn());
		          this.toasterService.pop('success', 'Login successful', 'Hello '+res.username+', welcome back on WeChain !');
		          this.router.navigate(['/home']);
		        },
		        err => {
		        	var message = JSON.parse(err._body).message
		            this.toasterService.pop('error', 'Error', 'Error occured during login process: '+message);
		        }
		    );
        }else if (resp.status === 'not_authorized') {
             console.log(resp)
        }else {
             console.log(resp)
        }
    };

}
