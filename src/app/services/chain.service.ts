import { Injectable } from '@angular/core';
import { Http, URLSearchParams } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class ChainService {
  constructor(private http: Http) {}

  getChains(start: number,end: number) {
    return this.makeGetRequest(`${start}/${end}`);
  }

  getChain(chainId: string) {
    return this.makeGetRequest(`${chainId}`);
  }

  getModeration(chainId: string) {
    return this.makeGetRequest(`${chainId}/moderation`);
  }

  toggleModeration(chainId: string) {
    return this.makePutRequest(`${chainId}/toggleModeration`,{});
  }

  approve(chainId: string,chainerId: string) {
    return this.makeGetRequest(`${chainId}/approve/${chainerId}`);
  }

  refuse(chainId: string,chainerId: string) {
    return this.makeGetRequest(`${chainId}/refuse/${chainerId}`);
  }

  deleteChainer(chainId: string,chainerId: string) {
    return this.makeGetRequest(`${chainId}/chainer/${chainerId}`);
  }

  private makeGetRequest(path: string) {
    let params = new URLSearchParams();
    //params.set('per_page', '100');

    let url = `https://backend.wechain.eu/v3/chains/${ path }`;
    return this.http.get(url)
      .map((res) => res.json());
  }

  private makePutRequest(path: string, data: any) {
    let params = new URLSearchParams();
    //params.set('per_page', '100');

    let url = `https://backend.wechain.eu/v3/chains/${ path }`;
    return this.http.put(url,data)
      .map((res) => res.json());
  }

  private makeDeleteRequest(path: string) {
    let params = new URLSearchParams();
    //params.set('per_page', '100');

    let url = `https://backend.wechain.eu/v3/chains/${ path }`;
    return this.http.delete(url)
      .map((res) => res.json());
  }
}
