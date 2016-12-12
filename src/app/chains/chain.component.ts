import {Component, OnInit, ViewContainerRef, ViewEncapsulation } from '@angular/core';
import {ChainService} from '../services/chain.service';
import {Observable} from 'rxjs/Observable';
import {ActivatedRoute} from '@angular/router';
import { Overlay } from 'angular2-modal';
import { Modal } from 'angular2-modal/plugins/bootstrap';
import {ToasterContainerComponent, ToasterService} from 'angular2-toaster/angular2-toaster';

@Component({
  selector: 'chain',
  styleUrls: ['./chain.component.css'],
  templateUrl: './chain.component.html'
})
export class ChainComponent implements OnInit {
  chainId: string;
  public chain:any = {};
  public loaded:boolean = false;
  private toasterService: ToasterService;

  constructor(public chainService: ChainService, private route: ActivatedRoute, overlay: Overlay, vcRef: ViewContainerRef, public modal: Modal, toasterService: ToasterService) {
     overlay.defaultViewContainer = vcRef;
     this.toasterService = toasterService; 
  }

  ngOnInit() {
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
    this.chainService.toggleModeration(this.chain.id)
    .subscribe(chain => {
      this.chain.isAdvertising = chain.isAdvertising;
    })
  }

  approve(chainer:any){
    this.modal.confirm()
        .size('lg')
        .showClose(true)
        .title('Confirm picture approval')
        .body("<h4>Are you sure you want to approve "+chainer.username+"'s picture ?</h4><img class='img-responsive img-fluid modal-wechain-image' src='http://pictures.wechain.eu/"+chainer.picture+"'>")
        .okBtn('Approve picture')
        .okBtnClass('btn btn-success')
        .open()
        .catch(err => alert("ERROR")) // catch error not related to the result (modal open...)
        .then( (resultPromise) => {
          resultPromise.result.then( (result) => {
               this.chainService.approve(this.chain._id,chainer._id)
              .subscribe(_ => {
                this.init(this.chain._id);
                this.toasterService.pop('success', 'Picture approved', 'Picture from '+chainer.username+' has been successfully approved');
              })
                 }, 
             () => {} );
         });
  }

  refuse(chainer:any){
    this.modal.confirm()
        .size('lg')
        .showClose(true)
        .title('Confirm picture refusal')
        .body("<h4>Are you sure you want to refuse "+chainer.username+"'s picture ?</h4><img class='img-fluid' src='http://pictures.wechain.eu/"+chainer.picture+"'>")
        .okBtn('Refuse picture')
        .okBtnClass('btn btn-danger')
        .open()
        .catch(err => alert("ERROR")) // catch error not related to the result (modal open...)
        .then( (resultPromise) => {
          resultPromise.result.then( (result) => {
               this.chainService.refuse(this.chain._id,chainer._id)
              .subscribe(_ => {
                this.init(this.chain._id);
                this.toasterService.pop('success', 'Picture refused', 'Picture from '+chainer.username+' has been successfully refused');
              })
                 }, 
             () => {} );
         });
  }

  see(chainer:any){
    this.modal.confirm()
        .size('lg')
        .showClose(true)
        .title('Picture from '+chainer.username)
        .body("<img class='img-responsive img-fluid' src='http://pictures.wechain.eu/"+chainer.picture+"'>")
        .okBtn('Delete picture')
        .okBtnClass('btn btn-danger')
        .open()
        .catch(err => alert("ERROR")) // catch error not related to the result (modal open...)
        .then( (resultPromise) => {
          resultPromise.result.then( (result) => {
               this.modal.confirm()
                  .size('sm')
                  .showClose(true)
                  .title("Are you want to delete picture from "+chainer.username+" ?")
                  .body("<p class='lead  text-xs-center col-xs-12'>This action cannot be undone</p>")
                  .okBtn('Delete picture')
                  .okBtnClass('btn btn-danger')
                  .open()
                  .catch(err => alert("ERROR")) // catch error not related to the result (modal open...)
                  .then( (resultPromise) => {
                    resultPromise.result.then( (result) => {
                         this.chainService.deleteChainer(this.chain._id,chainer._id)
                        .subscribe(_ => {
                          this.init(this.chain._id);
                          this.toasterService.pop('success', 'Picture approved', 'Picture from '+chainer.username+' has been successfully approved');
                        })
                           }, 
                       () => {} );
                   })
                 }, 
             () => {} );
         });
  }

   delete(chainer:any){
    this.modal.confirm()
        .size('lg')
        .showClose(true)
        .title('Delete picture from '+chainer.username+' ?')
        .body("<img class='img-responsive img-fluid' src='http://pictures.wechain.eu/"+chainer.picture+"'>")
        .okBtn('Delete picture')
        .okBtnClass('btn btn-danger')
        .open()
        .catch(err => alert("ERROR")) // catch error not related to the result (modal open...)
        .then( (resultPromise) => {
          resultPromise.result.then( (result) => {
               this.chainService.deleteChainer(this.chain._id,chainer._id)
              .subscribe(_ => {
                this.init(this.chain._id);
                this.toasterService.pop('success', 'Picture approved', 'Picture from '+chainer.username+' has been successfully approved');
              })
                 }, 
             () => {} );
         });
  }
}
