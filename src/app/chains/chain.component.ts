import {Component, OnInit, ViewContainerRef, ViewEncapsulation } from '@angular/core';
import {ChainService} from '../services/chain.service';
import {Observable} from 'rxjs/Observable';
import {ActivatedRoute} from '@angular/router';
import { Overlay } from 'angular2-modal';
import { Modal } from 'angular2-modal/plugins/bootstrap';

@Component({
  selector: 'chain',
  styleUrls: ['./chain.component.css'],
  templateUrl: './chain.component.html',
})
export class ChainComponent implements OnInit {
  chainId: string;
  public chain:any = {};
  public loaded:boolean = false;

  constructor(public chainService: ChainService, private route: ActivatedRoute, overlay: Overlay, vcRef: ViewContainerRef, public modal: Modal) {
    overlay.defaultViewContainer = vcRef;
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

  approve(chainerid:string){
    this.modal.alert()
        .size('lg')
        .showClose(true)
        .title('A simple Alert style modal window')
        .body(`
            <h4>Alert is a classic (title/body/footer) 1 button modal window that 
            does not block.</h4>
            <b>Configuration:</b>
            <ul>
                <li>Non blocking (click anywhere outside to dismiss)</li>
                <li>Size large</li>
                <li>Dismissed with default keyboard key (ESC)</li>
                <li>Close wth button click</li>
                <li>HTML content</li>
            </ul>`)
        .open();
    this.chainService.approve(this.chain._id,chainerid)
    .subscribe(_ => {
      this.init(this.chain._id);
    })
  }

  refuse(chainerid:string){
    this.chainService.refuse(this.chain._id,chainerid)
    .subscribe(_ => {
      this.init(this.chain._id);
    })
  }
}
