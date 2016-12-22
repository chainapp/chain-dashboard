import { Component, ViewChild  } from '@angular/core';
import { Router } from '@angular/router';
import { ChainService } from '../services/chain.service';
import {ImageCropperComponent, CropperSettings} from 'ng2-img-cropper';
import {FacebookService, FacebookLoginResponse} from 'ng2-facebook-sdk';
import { Angular2TokenService, A2tUiModule } from 'angular2-token';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
  providers: [FacebookService]
})
export class SignupComponent {
	post : FormGroup;
	

	constructor(private _tokenService: Angular2TokenService, fb: FormBuilder) {
	    this._tokenService.init();
	     this.post = fb.group({
	      'firstname' : [null, Validators.required],
	      'lastname' : [null, Validators.required],
	      'organization': true,
	      'organization_name': [null, Validators.required],
	      'email' : [null, Validators.required],
	      'password' :[null, Validators.compose([Validators.required, Validators.minLength(6), Validators.maxLength(10)])],
	      'confirmpassword' :[null, Validators.compose([Validators.required, Validators.minLength(6), Validators.maxLength(10)])],
	    })
	}


	signup(data){
		this._tokenService.post('https://backend.wechain.eu/auth/dashboard/signup',data).map(res => res.json()).subscribe(
		    res =>      console.log(res),
		    error =>    console.log(error)
		);
	}
	

}
