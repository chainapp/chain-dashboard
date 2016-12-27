import { Injectable } from '@angular/core';
import { Http, URLSearchParams, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import { Angular2TokenService } from 'angular2-token';

@Injectable()
export class AuthService {
  user: any = {};
  loggedIn: boolean = false;

  constructor(private http: Http, private _tokenService: Angular2TokenService) {}

  signup(data: any) {
    return this.http
      .post('https://backend.wechain.eu/auth/dashboard/signup',data)
      .map(res => res.json())
      .map((res) => {
      console.log(res)
        if (res._id && res._id != null) {       
        console.log("in status 201")  
          this.loggedIn = true;
          this.user = res;
        }else{
        console.log("not in right status")
          this.loggedIn = false;
          this.user = null;
        }

        return res;
      });
  }

  login(data: any) {
    return this.http
      .post('https://backend.wechain.eu/auth/dashboard/login',data)
      .map(res => res.json())
      .map((res) => {

        if (res._id && res._id != null) {         
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
    this._tokenService.get('https://backend.wechain.eu/dashboard/session/valid',{
      withCredentials: true,
      headers
    }).map(res => res.json());
  }

  token() {
    return this.user.jwt_token;
  }

  isLoggedIn() {
    return this.loggedIn;
  }

  getUser() {
    return this.user;
  }

  setProfilePic(file) {
    let headers = new Headers();
    headers.append('x-jwt-token', this.user.jwt_token);
    const formData = new FormData();
    formData.append("profilePicture", file);
    return this.http
      .post('https://backend.wechain.eu/dashboard/profilePicture',formData,{
        withCredentials: true,
        headers
      })
      .map(res => res.json())
      .map((res) => {

        if (res.status && res.status == "OK") {         
          this.user.profilePicture = res.profilePicture;
        }

        return res;
      });
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
