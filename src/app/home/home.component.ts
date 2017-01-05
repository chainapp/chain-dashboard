import {Component, Input, ViewChild} from '@angular/core';
import { Router } from '@angular/router';
import {ChainService} from '../services/chain.service';
import {AuthService} from '../services/auth.service';
import { ModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';
import {ToasterContainerComponent, ToasterService} from 'angular2-toaster/angular2-toaster';

@Component({
  selector: 'home',
  styleUrls: ['./home.component.css'],
  templateUrl: './home.component.html'
})
export class HomeComponent {
	public chains:any = [];
	private selectedChain: any = {};

	@Input() 
	model: any;
	@ViewChild('inviteModal')
  	inviteModal: ModalComponent;
  	private toasterService: ToasterService;

  	sms: any = "Copy/Paste phone numbers (format 336/7XXXXXXXX) separated by commas";
	mails: any = "Copy/Paste emails separated by commas";

	
	constructor(private router: Router, private chain: ChainService, toasterService: ToasterService, private authService: AuthService) {
		 this.toasterService = toasterService;
	}

	ngOnInit() {
		 this.authService.valid();
	    this.chain.getChains(0,10, this.authService.token())
	    .subscribe(chains => {
	    	console.log(chains)
            this.chains = chains;
          });
	 }

	 loadMore(){
	 	this.chain.getChains(this.chains.length,this.chains.length+10, this.authService.token())
	    .subscribe(chains => {
	    	console.log(chains)
            for ( var i = 0 ; i < chains.length ; i++){
            	this.chains.push(chains[i])
            }
          });
	 }

	 private search(searchstring: any): void {
        console.log("received "+searchstring)
    }

    inviteMore(chain: any){
    	this.selectedChain = chain;
	 	this.inviteModal.open();
	 }

	 confirmInviteMore(){
	 	this.chain.invite(this.selectedChain._id,(this.sms ? this.sms.replace(/ /g, "").split(',') : []),(this.mails ? this.mails.replace(/ /g, "").split(',') : []),this.authService.token()).subscribe(
	          	res => {
		          console.log(res);
		          this.inviteModal.close();
		          this.toasterService.pop('success', 'Invites sent', 'Your invites have been sent !');
		          this.selectedChain = {};
		 			this.sms = "Copy/Paste phone numbers (format 336/7XXXXXXXX) separated by commas";
					this.mails = "Copy/Paste emails separated by commas";
		        },
		        err => {
		        	this.inviteModal.close();
		        	//var message = JSON.parse(err._body).message
		            this.toasterService.pop('error', 'Error', 'Error occured during invitations. Please try again.');
		            this.selectedChain = {};
				 	this.sms = "Copy/Paste phone numbers (format 336/7XXXXXXXX) separated by commas";
					this.mails = "Copy/Paste emails separated by commas";
		        }
	          )
	 }

	 refuseInviteMore(){
	 	this.inviteModal.close();
	 	this.selectedChain = {};
	 	this.sms = "Copy/Paste phone numbers (format 336/7XXXXXXXX) separated by commas";
		this.mails = "Copy/Paste emails separated by commas";
	 }


	 emptySMS() {
  		this.sms = null;
	  }

	  emptyMails() {
  		this.mails = null;
	  }
	
}
