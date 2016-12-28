import { Injectable } from '@angular/core';
import { Http, URLSearchParams, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import { AuthService } from './auth.service';


@Injectable()
export class ChainService {
  constructor(private http: Http, private authService: AuthService) {}

  getChains(start: number,end: number, token: string) {
    let headers = new Headers();
    headers.append('x-jwt-token', token);
    return this.http
      .get('http://localhost:8080/dashboard/chains/'+start+'/'+end,{
        withCredentials: true,
        headers
      })
      .map(res => res.json())
      .map((res) => {
        return res;
      });
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

  createChain(data, file, token) {
    let headers = new Headers();
    headers.append('x-jwt-token', token);
    headers.append('title', data.title);
    headers.append('chain_origin', data.chain_origin);
    headers.append('event_type', data.event_type);
    headers.append('isAdvertising', data.isAdvertising);
    headers.append('restricted', data.restricted);
    headers.append('type', data.type);
    const formData = new FormData();
    formData.append("Image", file);
    return this.http
      .post('http://localhost:8080/dashboard/chains',formData,{
        withCredentials: true,
        headers
      })
      .map(res => res.json())
      .map((res) => {
        return res;
      });
  }

  private makeGetRequest(path: string) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('x-jwt-token', this.authService.token());

    let url = `http://localhost:8080/dashboard/chains/${ path }`;
    return this.http.get(url,{
      withCredentials: true,
      headers
    }).map((res) => res.json());
  }

  private makePutRequest(path: string, data: any) {
    let params = new URLSearchParams();
    //params.set('per_page', '100');

    let url = `http://localhost:8080/v3/chains/${ path }`;
    return this.http.put(url,data)
      .map((res) => res.json());
  }

  private makeDeleteRequest(path: string) {
    let params = new URLSearchParams();
    //params.set('per_page', '100');

    let url = `http://localhost:8080/v3/chains/${ path }`;
    return this.http.delete(url)
      .map((res) => res.json());
  }
}
