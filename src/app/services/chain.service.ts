import { Injectable } from '@angular/core';
import { Http, URLSearchParams } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class ChainService {
  constructor(private http: Http) {}

  getChains(start: number,end: number) {
    return this.makeRequest(`${start}/${end}`);
  }

  getChain(chainId: string) {
    return this.makeRequest(`${chainId}`);
  }

  getReposForOrg(org: string) {
    return this.makeRequest(`orgs/${org}/repos`);
  }

  getRepoForOrg(org: string, repo: string) {
    return this.makeRequest(`repos/${org}/${repo}`);
  }

  private makeRequest(path: string) {
    let params = new URLSearchParams();
    //params.set('per_page', '100');

    let url = `http://localhost:8080/v3/chains/${ path }`;
    return this.http.get(url)
      .map((res) => res.json());
  }
}
