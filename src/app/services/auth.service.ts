import { Injectable } from '@angular/core';
import { Http, URLSearchParams, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import { Angular2TokenService } from 'angular2-token';

@Injectable()
export class AuthService {
  user: any = {};
  loggedIn: boolean = false;

  constructor(private http: Http, private _tokenService: Angular2TokenService) {

  }

  signup(data: any) {
    return this.http
      .post('http://localhost:8080/auth/dashboard/signup',data)
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
      .post('http://localhost:8080/auth/dashboard/login',data)
      .map(res => res.json())
      .map((res) => {

        if (res._id && res._id != null) {         
          this.loggedIn = true;
          this.user = res;
          sessionStorage.setItem("user", JSON.stringify(this.user));
          sessionStorage.setItem("loggedIn",true.toString());
        }else{
          this.loggedIn = false;
          this.user = null;
          sessionStorage.removeItem("user");
          sessionStorage.setItem("loggedIn",false.toString());
        }

        return res;
      });
  }

  valid() {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('x-jwt-token', JSON.parse(sessionStorage.getItem("user")).jwt_token);
    return this.http
    .get('http://localhost:8080/auth/dashboard/validate',{
      withCredentials: true,
      headers
    }).map(res => res.json())
    .map((res) => {
      console.log(res);
        if (!res.valid){
          sessionStorage.removeItem("user");
          sessionStorage.setItem("loggedIn",false.toString());
        }
        return res;
      });
  }

  token() {
    return JSON.parse(sessionStorage.getItem("user")).jwt_token;
  }

  isLoggedIn() {
    return (sessionStorage.getItem("loggedIn") === 'true');
  }

  getUser() {
    return this.user;
  }

  setProfilePic(file) {
    let headers = new Headers();
    headers.append('x-jwt-token', JSON.parse(sessionStorage.getItem("user")).jwt_token);
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
