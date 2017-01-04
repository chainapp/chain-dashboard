import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import * as io from 'socket.io-client';

export class SocketService {
  private url = 'https://backend.wechain.eu';  
  private socket;
  
  sendMessage(message){
    this.socket.emit('add-message', message);    
  }
  
  getFullStreamMessages(chainId: any) {
    let obj = {
      chunks_size : 200,
      delay : 10,
      stream : chainId+"_full_stream"
    }
    let observable = new Observable(observer => {
      this.socket = io(this.url);
      
      this.socket.emit('init', obj);
      this.socket.on('message', (data) => {
        observer.next(data);    
      });
      return () => {
        this.socket.disconnect();
      };  
    })     
    return observable;
  }  

  getModerationmMessages(chainId: any) {
    let obj = {
      chunks_size : 200,
      delay : 10,
      stream : chainId+"_moderation"
    }
    let observable = new Observable(observer => {
      this.socket = io(this.url);
      this.socket.emit('init', obj);
      this.socket.on('message', (data) => {
        observer.next(data);    
      });
      return () => {
        this.socket.disconnect();
      };  
    })     
    return observable;
  }  
}