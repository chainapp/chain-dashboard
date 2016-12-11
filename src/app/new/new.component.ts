import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ChainService } from '../services/chain.service';

@Component({
  selector: 'new',
  templateUrl: './new.component.html',
  styleUrls: ['./new.component.css']
})
export class NewComponent {

	public steps = [true,false,false,false,false,false,false];

	constructor(private router: Router, private chain: ChainService) {
	}

  	next(i) {
  		this.steps[i]=false
	    this.steps[i+1]=true;
	  }
	  back(i) {
  		this.steps[i]=false
	    this.steps[i-1]=true;
	  }

}
