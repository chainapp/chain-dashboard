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
  selector: 'signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
  providers: [FacebookService]
})
export class SignupComponent {
	post : FormGroup = new FormGroup({
	   firstname: new FormControl(''),
	   lastname: new FormControl(''),
	   organization: new FormControl(true,Validators.required),
	   organization_name: new FormControl(''),
	   email: new FormControl('',Validators.required),
	   password: new FormControl('',Validators.required),
	   confirmpassword: new FormControl('',Validators.required)
	},Validators.compose([this.passwordMatchValidator,this.orgaOrPersonValidator]));
	private toasterService: ToasterService;
	

	constructor(private router: Router, private _tokenService: Angular2TokenService, fb: FormBuilder, private authService: AuthService, toasterService: ToasterService) {
	    this._tokenService.init();
	}


	signup(data){
		this.authService.signup(data).subscribe(
	        res => {
	          console.log(res);
	          this.toasterService.pop('success', 'Welcome !', 'Welcome on WeChain '+res.username+' !');
	          this.router.navigate(['/home']);
	        },
	        err => {
	        	var message = JSON.parse(err._body).message
	            this.toasterService.pop('error', 'Error', 'Error occured during signup process: '+message);
	        }
	    );
	}

	passwordMatchValidator(g: FormGroup) {
		console.log(g.value)
		console.log("in password match")
	   return (g.get('password').value.length >= 6 && (g.get('password').value === g.get('confirmpassword').value))
	      ? null : {'mismatch': true};
	}
	orgaOrPersonValidator(g: FormGroup) {
		console.log("in orga or person match")
	   return ((g.get('organization').value === true && g.get('organization_name').value.length > 0)
	   		|| (g.get('organization').value === false && g.get('firstname').value.length > 0 && g.get('lastname').value.length > 0))
	      ? null : {'mismatch': true};
	}
	

}
