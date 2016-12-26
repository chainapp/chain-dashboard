import { Injectable } from '@angular/core';
import { Http, URLSearchParams, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import { AuthService } from './auth.service';


@Injectable()
export class ChainService {
  constructor(private http: Http, private authService: AuthService) {}

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
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('x-jwt-token', this.authService.token());

    let url = `https://backend.wechain.eu/dashboard/chains/${ path }`;
    return this.http.get(url,{
      withCredentials: true,
      headers
    }).map((res) => res.json());
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
