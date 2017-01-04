import { Component, ViewChild, ViewContainerRef  } from '@angular/core';
import { Router } from '@angular/router';
import { ChainService } from '../services/chain.service';
import { AuthService } from '../services/auth.service';
import {ImageCropperComponent, CropperSettings} from 'ng2-img-cropper';
import {FacebookService, FacebookLoginResponse} from 'ng2-facebook-sdk';
import { Angular2TokenService, A2tUiModule } from 'angular2-token';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import {ToasterContainerComponent, ToasterService} from 'angular2-toaster/angular2-toaster';
import { Overlay } from 'angular2-modal';
import { Modal } from 'angular2-modal/plugins/bootstrap';

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
	data: any;
    cropperSettings: CropperSettings;
    @ViewChild('cropper', undefined) 
	cropper:ImageCropperComponent;
	hasImage: boolean = false;
	file:File = null;

	

	constructor(private router: Router, private _tokenService: Angular2TokenService, fb: FormBuilder, private authService: AuthService, toasterService: ToasterService, overlay: Overlay, vcRef: ViewContainerRef, public modal: Modal) {
	    overlay.defaultViewContainer = vcRef;
	    this._tokenService.init();
	    this.toasterService = toasterService;
	    this.cropperSettings = new CropperSettings();
        this.cropperSettings.noFileInput = true;
        this.cropperSettings.croppedWidth = 320;
        this.cropperSettings.croppedHeight = 320;
        this.cropperSettings.width = 100;
        this.cropperSettings.height = 100;
        this.cropperSettings.canvasWidth = 200;
        this.cropperSettings.canvasHeight = 200;
        this.data = {};
	}

	fileChangeListener($event) {
		this.hasImage = true;
	    var image:any = new Image();
	    this.file = $event.target.files[0];
	    var myReader:FileReader = new FileReader();
	    var that = this;
	    myReader.onloadend = function (loadEvent:any) {
	        image.src = loadEvent.target.result;
	        that.cropper.setImage(image);
	    };

	    myReader.readAsDataURL(this.file);
	    console.log(myReader)
	}


	signup(data){
		this.authService.signup(data).subscribe(
	        res => {
	          console.log(res);
	          this.toasterService.pop('success', 'Welcome !', 'Welcome on WeChain '+res.username+' !'); 
	          this.authService.setProfilePic(this.file, this.authService.token()).subscribe(
	          	res => {	          		         
	          		this.router.navigate(['/home']);
	          	},
	          	err => {

	          	})
	          
	        },
	        err => {
	        	var message = JSON.parse(err._body).message
	            this.toasterService.pop('error', 'Error', 'Error occured during signup process: '+message);
	        }
	    );
	}

	passwordMatchValidator(g: FormGroup) {
	   return (g.get('password').value.length >= 6 && (g.get('password').value === g.get('confirmpassword').value))
	      ? null : {'mismatch': true};
	}
	orgaOrPersonValidator(g: FormGroup) {
	   return ((g.get('organization').value === true && g.get('organization_name').value.length > 0)
	   		|| (g.get('organization').value === false && g.get('firstname').value.length > 0 && g.get('lastname').value.length > 0))
	      ? null : {'mismatch': true};
	}
	

}
