import {Injectable} from "@angular/core";
import {ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot} from "@angular/router";
import {Http} from "@angular/http";

@Injectable()
export class ClientValidateService implements CanActivate {
  client_id: string;
  redirect_uri: string;
  state: string;
  scope: string;

  constructor(private http: Http) {
  }
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    this.client_id = route.params['client_id'];
    this.redirect_uri = route.params['redirect_uri'];
    this.scope = route.params['scope'];
    this.state = route.params['state']
    return new Promise((resolve) => {
      if (this.client_id != null && this.redirect_uri != null) {
        resolve(true)
      } else {
        console.log(`client_id is none and redirect_uri is none`)
        resolve(false)
      }
    })
  }
}
