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

	 loadMore(){
	 	this.chain.getChains(this.chains.length,this.chains.length+10)
	    .subscribe(chains => {
	    	console.log(chains)
            for ( var i = 0 ; i < chains.length ; i++){
            	this.chains.push(chains[i])
            }
          });
	 }

	
}
