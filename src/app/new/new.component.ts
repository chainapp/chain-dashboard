import { Component, ViewChild  } from '@angular/core';
import { Router } from '@angular/router';
import { ChainService } from '../services/chain.service';
import {ImageCropperComponent, CropperSettings} from 'ng2-img-cropper';

@Component({
  selector: 'new',
  templateUrl: './new.component.html',
  styleUrls: ['./new.component.css']
})
export class NewComponent {
	chain: any = {
		origin: "dashboard",
		title: null,
		type: "PUBLIC",
		event_type: "Party",
		isAdvertising: false,
		restricted: false
	};
	data: any;
    cropperSettings: CropperSettings;
    @ViewChild('cropper', undefined) 
	cropper:ImageCropperComponent;
	hasImage: boolean = false;

	public steps = [true,false,false,false,false,false,false];

	constructor(private router: Router, private chainService: ChainService) {
		this.cropperSettings = new CropperSettings();
        //this.cropperSettings.width = 320;
        //this.cropperSettings.height = 320;
        this.cropperSettings.noFileInput = true;
        this.cropperSettings.croppedWidth =640;
        this.cropperSettings.croppedHeight = 640;
        //this.cropperSettings.canvasWidth = 640;
        //this.cropperSettings.canvasHeight = 640;

        this.data = {};
	}

	fileChangeListener($event) {
		this.hasImage = true;
	    var image:any = new Image();
	    var file:File = $event.target.files[0];
	    var myReader:FileReader = new FileReader();
	    var that = this;
	    myReader.onloadend = function (loadEvent:any) {
	        image.src = loadEvent.target.result;
	        that.cropper.setImage(image);
	    };

	    myReader.readAsDataURL(file);
	}


  	next(i) {
  		this.steps[i]=false
	    this.steps[i+1]=true;
	    if (i == 5){
	    	console.log(this.chain)
	    }
	  }
	  back(i) {
  		this.steps[i]=false
	    this.steps[i-1]=true;
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
