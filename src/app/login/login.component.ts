import { Component, ViewChild  } from '@angular/core';
import { Router } from '@angular/router';
import { ChainService } from '../services/chain.service';
import { AuthService } from '../services/auth.service';
import {ImageCropperComponent, CropperSettings} from 'ng2-img-cropper';
import {FacebookService, FacebookLoginResponse} from 'ng2-facebook-sdk';
import { Angular2TokenService, A2tUiModule } from 'angular2-token';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import {ToasterContainerComponent, ToasterService} from 'angular2-toaster/angular2-toaster';


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
	}

	ngOnInit() {
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
	          this.authService.confirmLogin(res);
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

}
