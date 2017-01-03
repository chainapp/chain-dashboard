import { Component, ViewChild, ElementRef  } from '@angular/core';
import { Router } from '@angular/router';
import { ChainService } from '../services/chain.service';
import { AuthService } from '../services/auth.service';
import {ImageCropperComponent, CropperSettings, Bounds} from 'ng2-img-cropper';
import {ToasterContainerComponent, ToasterService} from 'angular2-toaster/angular2-toaster';

@Component({
  selector: 'new',
  templateUrl: './new.component.html',
  styleUrls: ['./new.component.css']
})
export class NewComponent {
	chain: any = {
		chain_origin: "dashboard",
		title: null,
		type: "PUBLIC",
		event_type: "Party",
		isAdvertising: false,
		restricted: false
	};
	sms: any = "Copy/Paste phone numbers (format 336/7XXXXXXXX) separated by commas";
	mails: any = "Copy/Paste emails separated by commas";
	data: any;
    cropperSettings: CropperSettings;
    @ViewChild('cropper', undefined) 
	cropper:ImageCropperComponent;
	hasImage: boolean = false;
	file:File = null;

	public steps = [true,false,false,false,false,false,false];

	constructor(private router: Router, private chainService: ChainService, private authService: AuthService,private toasterService: ToasterService, private element: ElementRef) {
		this.cropperSettings = new CropperSettings();
        this.cropperSettings.noFileInput = true;
        this.cropperSettings.croppedWidth =640;
        this.cropperSettings.croppedHeight = 640;

        this.data = {};
        this.toasterService = toasterService; 
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
	}


  	next(i) {
  		this.steps[i]=false
	    this.steps[i+1]=true;
	    if (i == 5){
	    	console.log(this.chain);
	    	this.createChain();
	    }
	  }
	  back(i) {
  		this.steps[i]=false
	    this.steps[i-1]=true;
	  }

	createChain(){
	 console.log(this.data);
	 console.log(this.sms);
	 console.log(this.mails);
	 var croppedImage = this.element.nativeElement.querySelector('#croppedImage');

		this.chainService.createChain(this.chain,this.file,this.authService.token()).subscribe(
	        res => {
	          this.chain._id = res._id;
	          this.chainService.invite(this.chain._id,this.sms.replace(/ /g, "").split(','),this.mails.replace(/ /g, "").split(','),this.authService.token()).subscribe(
	          	res => {
		          console.log(res);
		        },
		        err => {
		        	//var message = JSON.parse(err._body).message
		            this.toasterService.pop('error', 'Error', 'Error occured during chain creation. Please try again.');
		        }
	          )
	        },
	        err => {
	        	//var message = JSON.parse(err._body).message
	            this.toasterService.pop('error', 'Error', 'Error occured during chain creation. Please try again.');
	        }
	    );
	}

	  _keyPress(event: any) {
	    const pattern = /[ ]/;
	    let inputChar = String.fromCharCode(event.charCode);
	    // console.log(inputChar, e.charCode);
	    if (pattern.test(inputChar)) {
	      // invalid character, prevent input
	      event.preventDefault();
	    }
	}

}
