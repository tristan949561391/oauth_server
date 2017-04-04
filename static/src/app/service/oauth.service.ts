import {Injectable} from "@angular/core";
import {Http} from "@angular/http";

@Injectable()
export class OauthService {

  auth_client_uri: string = '/oauth/client/validate.md';
  auth_login_uri: string = '/oauth/authorize.md';

  constructor(private http: Http) {

  }


  oauth_login(username: string, password: string, client_id: string, redirect_uri: string, scope: string, state: number): Promise<any> {
    let param = {
      client_id: client_id,
      redirect_uri: redirect_uri,
      scope: scope,
      state: state,
      username: username,
      password: password
    }
    return new Promise((resolve, reject) => {
      this.http.post(this.auth_login_uri, param).map(res => res.json()).subscribe(
        (data) => {
          resolve(data)
        },
        (err) => {
          let e = JSON.parse(err._body)
          reject(e)
        }
      )
    })
  }

  get_client_profile(client_id: string, redirect_uri: string, scope: string): Promise<any> {
    let params = {
      client_id: client_id,
      redirect_uri: redirect_uri,
      scope: scope
    }
    return new Promise((resolve, reject) => {
      this.http.post(this.auth_client_uri, params).map(rea => rea.json()).subscribe((data) => {
        resolve(data)
      }, (err) => {
        reject(JSON.parse(err._body))
      })
    })
  }
}
