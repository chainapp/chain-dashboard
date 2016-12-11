import {Component} from '@angular/core';
import { Router } from '@angular/router';
import {ChainService} from '../services/chain.service';

@Component({
  selector: 'home',
  styleUrls: ['./home.component.css'],
  templateUrl: './home.component.html'
})
export class HomeComponent {
	public chains:any = [];
	
	constructor(private router: Router, private chain: ChainService) {
	}

	ngOnInit() {
	    this.chain.getChains(0,10)
	    .subscribe(chains => {
	    	console.log(chains)
            this.chains = chains;
          });
	  }

	
}
