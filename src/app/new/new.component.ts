import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ChainService } from '../services/chain.service';

@Component({
  selector: 'new',
  templateUrl: './new.component.html',
  styleUrls: ['./new.component.css']
})
export class NewComponent {

  constructor(private router: Router, private chain: ChainService) {
  }

  

}
