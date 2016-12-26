import { Injectable } from '@angular/core';
import { Http, URLSearchParams, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import { Angular2TokenService } from 'angular2-token';

@Injectable()
export class AuthService {
  user: any = null;
  loggedIn: boolean = false;

  constructor(private http: Http, private _tokenService: Angular2TokenService) {}

  signup(data: any) {
    return this.http
      .post('http://localhost:8080/auth/dashboard/signup',data)
      .map(res => res.json())
      .map((res) => {
        if (res.success) {         
          this.loggedIn = true;
          this.user = res;
        }else{
          this.loggedIn = false;
          this.user = null;
        }

        return res;
      });
  }

  login(data: any) {
    return this.http
      .post('http://localhost:8080/auth/dashboard/login',data)
      .map(res => res.json())
      .map((res) => {
        if (res.success) {         
          this.loggedIn = true;
          this.user = res;
        }else{
          this.loggedIn = false;
          this.user = null;
        }

        return res;
      });
  }

  valid() {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('x-jwt-token', this.user.jwt_token);
    this._tokenService.get('http://localhost:8080/dashboard/session/valid',{
      withCredentials: true,
      headers
    }).map(res => res.json());
  }

  token() {
    return this.user.jwt_token;
  }

  confirmLogin(user) {
    this.user = user;
    this.loggedIn = true;
  }

  isLoggedIn() {
    return this.loggedIn;
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
