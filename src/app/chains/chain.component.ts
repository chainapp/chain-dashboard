import {Component, OnInit} from '@angular/core';
import {ChainService} from '../services/chain.service';
import {Observable} from 'rxjs/Observable';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'chain',
  styleUrls: ['./chain.component.css'],
  templateUrl: './chain.component.html',
})
export class ChainComponent implements OnInit {
  chainId: string;
  public chain:any = {};
  public loaded:boolean = false;

  constructor(public chainService: ChainService, private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.chainId = params['chainId'];
      if (this.chainId) {
        this.chainService.getChain(this.chainId)
	    .subscribe(chain => {
	    	console.log(chain)
	    	this.loaded = true;
            this.chain = chain;
          });
      }
    });
  }
}
