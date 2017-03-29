import {Injectable} from "@angular/core";
import {ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot} from "@angular/router";
import {Http, RequestOptions} from "@angular/http";
import {Observable} from "rxjs";

@Injectable()
export class ClientValidateService implements CanActivate {
  client_id: string;
  redirect_uri: string;
  state: string;
  scope: string;
  auth_client_uri: string = '/oauth/client/validate'

  constructor(private http: Http) {

  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    this.client_id = route.params['client_id'];
    this.redirect_uri = route.params['redirect_uri'];
    this.scope = route.params['scope'];
    this.state = route.params['state']
    return new Promise((resolve, reject) => {
      if (this.client_id != null && this.redirect_uri != null) {
        console.log(`client_id is ${this.client_id} and redirect_uri is ${this.redirect_uri}`)

        this.validateClient(route.params).subscribe(() => {
          resolve(true)
            , (err) => {
            resolve(false)
          }
        });
      } else {
        console.log(`client_id is none and redirect_uri is none`)
        resolve(false)
      }
    })
  }

  validateClient(params: any): Observable<Boolean> {
    return this.http.post(this.auth_client_uri, params).map((res) => {
      return true;
    }).catch((err) => {
      return Observable.throw(err);
    })
  }
}
