import {Component, OnInit, ViewContainerRef, ViewEncapsulation, ViewChild } from '@angular/core';
import {ChainService} from '../services/chain.service';
import {AuthService} from '../services/auth.service';
import {SocketService} from '../services/socket.service';
import {Observable} from 'rxjs/Observable';
import {ActivatedRoute} from '@angular/router';
import { Overlay } from 'angular2-modal';
import { Modal } from 'angular2-modal/plugins/bootstrap';
import {ToasterContainerComponent, ToasterService} from 'angular2-toaster/angular2-toaster';
import {PopoverModule} from "ng2-popover";
import { UiSwitchModule } from 'angular2-ui-switch'
import { ModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';
import * as io from 'socket.io-client';

@Component({
  selector: 'chain',
  styleUrls: ['./chain.component.css'],
  templateUrl: './chain.component.html'
})
export class ChainComponent implements OnInit {
  chainId: string;
  selectedChainer: any = {};
  public chain:any = {};
  public loaded:boolean = false;
  private toasterService: ToasterService;
  connectionFullStream;
  connectionModeration;
  
  @ViewChild('approvalModal')
  approvalModal: ModalComponent;
  @ViewChild('refusalModal')
  refusalModal: ModalComponent;
  @ViewChild('displayModal')
  displayModal: ModalComponent;
  @ViewChild('deleteModal')
  deleteModal: ModalComponent;
  @ViewChild('inviteModal')
  inviteModal: ModalComponent;

  private url = 'https://backend.wechain.eu';  
  private fullStreamSocket;
  private moderationSocket;

  sms: any = "Copy/Paste phone numbers (format 336/7XXXXXXXX) separated by commas";
  mails: any = "Copy/Paste emails separated by commas";


  constructor(public chainService: ChainService, private route: ActivatedRoute, overlay: Overlay, vcRef: ViewContainerRef, public modal: Modal, toasterService: ToasterService, private authService: AuthService) {
     overlay.defaultViewContainer = vcRef;
     this.toasterService = toasterService;
     this.chain.chainers = [];
     this.chain.moderation = [];
  }

  ngOnInit() {
    this.authService.valid();
    this.route.params.subscribe(params => {
      this.chainId = params['chainId'];
      if (this.chainId) {
        this.init(this.chainId);

        this.chain.chainers = [];
        this.chain.moderation = [];

        this.fullStreamSocket = io(this.url);
        let fullstream = {
          chunks_size : 200,
          delay : 10,
          stream : this.chainId+"_full_stream"
        }
        this.fullStreamSocket.emit('join', this.chainId+"_full_stream");
        this.fullStreamSocket.emit('init', fullstream);
        this.fullStreamSocket.on('data', (data) => {
          console.log("fullstream socket has received data event");
          this.chain.chainers = [];
          for (var i = 0 ; i < data.length; i++){
            if (i % 2 == 0){
              var chainer = JSON.parse(data[i]);
              this.chain.chainers.push(chainer);
            }
          }
        })
        this.fullStreamSocket.on('new_picture', (data) => {
          console.log("fullstream socket has received new_picture event");
          this.chain.chainers.push(data);
        })
        this.fullStreamSocket.on('delete_picture', (data) => {
          console.log("fullstream socket has received delete_picture event");
          for (var i = 0 ; i < this.chain.chainers.length ; i++){
            if (data._id == this.chain.chainers[i]._id){
              this.chain.chainers.splice(i,1);
            }
          }
        })


        this.moderationSocket = io(this.url);
        let moderation = {
          chunks_size : 200,
          delay : 10,
          stream : this.chainId+"_moderation"
        }
        this.moderationSocket.emit('join', this.chainId+"_moderation");
        this.moderationSocket.emit('init', moderation);
        this.moderationSocket.on('data', (data) => {
          console.log("moderation socket has received data event")
          this.chain.moderation = [];
          for (var i = 0 ; i < data.length; i++){
            if (i % 2 == 0){
              var chainer = JSON.parse(data[i]);
              this.chain.moderation.push(chainer);
            }
          }
        })
        this.moderationSocket.on('new_picture', (data) => {
          console.log("moderation socket has received new_picture event")
          this.chain.moderation.push(data);
        })
        this.moderationSocket.on('delete_picture', (data) => {
          console.log("fullstream socket has received delete_picture event");
          for (var i = 0 ; i < this.chain.moderation.length ; i++){
            if (data._id == this.chain.moderation[i]._id){
              this.chain.moderation.splice(i,1);
            }
          }
        })
      }
    });
  }

  init(chainId: string){
    this.chainService.getChain(this.chainId)
        .subscribe(chain => {
          console.log(chain)
          this.loaded = true;
          this.chain = chain;
          this.chain.chainers.push(this.chain.author);
          this.chain.moderation = [];
          if (this.chain.isAdvertising && chain.moderation_count > 0){
            this.chainService.getModeration(this.chainId)
            .subscribe(pictures => {
              console.log(pictures);
              for (var i = 0 ; i < pictures.length ; i++){
                this.chain.moderation.push(JSON.parse(pictures[i]));
              }
              
             });
          }         
         });
  }

  openChainer(chainer: any) {
    //$('#myModal').modal('toggle');
    console.log(chainer);
    //this.modal.chainer = chainer;
  }

  toggleModeration(){
    this.chainService.toggleModeration(this.chain._id)
    .subscribe(chain => {
      this.chain.isAdvertising = chain.isAdvertising;
    })
  }

  approve(chainer:any){
    this.selectedChainer = chainer
    this.approvalModal.open();
  }

  approveConfirmed(chainer:any){
    this.chainService.approve(this.chain._id,chainer._id)
    .subscribe(_ => {
      //this.init(this.chain._id);
      this.toasterService.pop('success', 'Picture approved', 'Picture from '+chainer.username+' has been successfully approved');
      this.approvalModal.close();
    })
  }

  approveCanceled(){
    this.selectedChainer = {};
    this.approvalModal.dismiss();
  }

  refuse(chainer:any){
    this.selectedChainer = chainer
    this.refusalModal.open();
  }

  refuseConfirmed(chainer:any){
    this.chainService.refuse(this.chain._id,chainer._id)
    .subscribe(_ => {
      //this.init(this.chain._id);
      this.toasterService.pop('success', 'Picture refused', 'Picture from '+chainer.username+' has been successfully refused');
      this.refusalModal.close();
    })
  }

  refuseCanceled(){
    this.selectedChainer = {};
    this.refusalModal.dismiss();
  }

  see(chainer:any){
    this.selectedChainer = chainer;
    this.displayModal.open();
  }

  deleteConfirmed(chainer: any){
    this.chainService.deleteChainer(this.chain._id,chainer._id, this.authService.token())
    .subscribe(_ => {
      //this.init(this.chain._id);
      this.toasterService.pop('success', 'Picture deleted', 'Picture from '+chainer.username+' has been successfully deleted');
      this.displayModal.close();
      this.deleteModal.close();
    })
  }

  delete(chainer:any){
    this.selectedChainer = chainer;
    this.deleteModal.open();
  }

  inviteMore(){
    this.inviteModal.open();
   }

  confirmInviteMore(){
    this.chainService.invite(this.chain._id,(this.sms ? this.sms.replace(/ /g, "").split(',') : []),(this.mails ? this.mails.replace(/ /g, "").split(',') : []),this.authService.token())
    .subscribe( res => {
        console.log(res);
        this.inviteModal.close();
        this.toasterService.pop('success', 'Invites sent', 'Your invites have been sent !');
        this.sms = "Copy/Paste phone numbers (format 336/7XXXXXXXX) separated by commas";
        this.mails = "Copy/Paste emails separated by commas";
      },
      err => {
          this.inviteModal.close();
          this.toasterService.pop('error', 'Error', 'Error occured during invitations. Please try again.');
          this.sms = "Copy/Paste phone numbers (format 336/7XXXXXXXX) separated by commas";
          this.mails = "Copy/Paste emails separated by commas";
      }
    )
  }

  refuseInviteMore(){
    this.inviteModal.close();
    this.sms = "Copy/Paste phone numbers (format 336/7XXXXXXXX) separated by commas";
    this.mails = "Copy/Paste emails separated by commas";
   }

  emptySMS() {
    if (this.sms == "Copy/Paste phone numbers (format 336/7XXXXXXXX) separated by commas"){
      this.sms = null;
    }
  }

  emptyMails() {
    if (this.mails == "Copy/Paste emails separated by commas"){
      this.mails = null;
    }
  }


  compareChainers(a,b) {
    if (a.created_at < b.created_at)
      return -1;
    if (a.created_at > b.created_at)
      return 1;
    return 0;
  }
}
