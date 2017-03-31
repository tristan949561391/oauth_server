import {Injectable} from "@angular/core";
import {Http} from "@angular/http";

@Injectable()
export class OauthService {

  auth_client_uri: string = 'http://localhost:3000/oauth/client/validate.md';
  auth_login_uri: string = 'http://localhost:3000/oauth/authorize.md';

  constructor(private http: Http) {

  }


  oauth_login(username: string, password: string, client: any): Promise<any> {
    let param = {
      client_id: client.client_id,
      redirect_uri: client.redirect_uri,
      scope: client.scope,
      state: client.state,
      username: username,
      password: password
    }
    return new Promise((resolve) => {
      this.http.post(this.auth_login_uri, param).map(res => res.json()).subscribe(
        (data) => {
          resolve(data)
        },
        (err) => {
          resolve(null)
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
    return new Promise((resolve) => {
      if (client_id != null && redirect_uri != null) {
        this.http.post(this.auth_client_uri, params).map(rea => rea.json()).subscribe((data) => {
          resolve(data)
        }, (err) => {
          console.log(err)
          resolve(null)
        })
      } else {
        resolve(null)
      }
    })
  }
}
