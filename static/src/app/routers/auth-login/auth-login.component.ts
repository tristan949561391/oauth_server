import {Component, OnInit} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {OauthService} from "../../service/oauth.service";

@Component({
  selector: 'app-auth-login',
  templateUrl: './auth-login.component.html',
  styleUrls: ['./auth-login.component.css']
})
export class AuthLoginComponent implements OnInit {
  clientProfile: any;
  username: string;
  password: string;
  scope: string;
  redirect_uri: string;
  client_id: string;
  state: number;
  error: string;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private oauthService: OauthService) {
  }

  ngOnInit() {
    this.route.params.subscribe((params) => {
        this.client_id = params['client_id'];
        this.scope = params['scope'];
        this.redirect_uri = params['redirect_uri'];
        this.state = params['state'];
        this.oauthService.get_client_profile(this.client_id, this.redirect_uri, this.scope).then(
          (client) => {
            this.clientProfile = client
          }
        )
      }
    )
  }

  async doLogin() {
    try {
      let res = await this.oauthService.oauth_login(this.username, this.password, this.client_id, this.redirect_uri, this.scope, this.state);
      window.location.href = `${this.clientProfile.redirect_uri}?code=${res.code}&state=${res.state}&timestamp=${new Date().getDate()}`;
    } catch (e) {
      this.error = e.message;
    }
  }


}
