import { Component, ViewChild  } from '@angular/core';
import { Router } from '@angular/router';
import { ChainService } from '../services/chain.service';
import {ImageCropperComponent, CropperSettings} from 'ng2-img-cropper';
import {FacebookService, FacebookLoginResponse} from 'ng2-facebook-sdk';

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [FacebookService]
})
export class LoginComponent {
	post: any = {
		organization: true
	};
	

}
