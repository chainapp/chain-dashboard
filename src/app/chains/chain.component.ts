import {Component, OnInit, ViewContainerRef, ViewEncapsulation, ViewChild } from '@angular/core';
import {ChainService} from '../services/chain.service';
import {AuthService} from '../services/auth.service';
import {Observable} from 'rxjs/Observable';
import {ActivatedRoute} from '@angular/router';
import { Overlay } from 'angular2-modal';
import { Modal } from 'angular2-modal/plugins/bootstrap';
import {ToasterContainerComponent, ToasterService} from 'angular2-toaster/angular2-toaster';
import {PopoverModule} from "ng2-popover";
import { UiSwitchModule } from 'angular2-ui-switch'
import { ModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';

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
  
  @ViewChild('approvalModal')
  approvalModal: ModalComponent;
  @ViewChild('refusalModal')
  refusalModal: ModalComponent;
  @ViewChild('displayModal')
  displayModal: ModalComponent;
  @ViewChild('deleteModal')
  deleteModal: ModalComponent;

  constructor(public chainService: ChainService, private route: ActivatedRoute, overlay: Overlay, vcRef: ViewContainerRef, public modal: Modal, toasterService: ToasterService, private authService: AuthService) {
     overlay.defaultViewContainer = vcRef;
     this.toasterService = toasterService; 
  }

  ngOnInit() {
    this.authService.valid();
    this.route.params.subscribe(params => {
      this.chainId = params['chainId'];
      if (this.chainId) {
        this.init(this.chainId);
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
      this.init(this.chain._id);
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
      this.init(this.chain._id);
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
    this.chainService.deleteChainer(this.chain._id,chainer._id)
    .subscribe(_ => {
      this.init(this.chain._id);
      this.toasterService.pop('success', 'Picture deleted', 'Picture from '+chainer.username+' has been successfully deleted');
      this.displayModal.close();
      this.deleteModal.close();
    })
  }

   delete(chainer:any){
    this.selectedChainer = chainer;
    this.deleteModal.open();
  }
}
