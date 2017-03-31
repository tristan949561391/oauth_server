import {Component, OnInit} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {OauthService} from "../../service/oauth.service";

@Component({
  selector: 'app-auth-login',
  templateUrl: './auth-login.component.html',
  styleUrls: ['./auth-login.component.css']
})
export class AuthLoginComponent implements OnInit {
  client: any;
  username: string;
  password: string;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private oauthService: OauthService) {
  }

  ngOnInit() {
    this.route.params.subscribe((params) => {
        this.oauthService.get_client_profile(params['client_id'], params['redirect_uri'], params['scope']).then(
          (client) => {
            this.client = client
          }
        )
      }
    )
  }
  doLogin() {
    console.log('you click dologin')
    this.oauthService.oauth_login(this.username, this.password, this.client).then(res => {
      console.log(res)
      window.location.href=`${this.client.redirect_uri}?code=${res.code}`
    }, err => {
      console.log(err)
    })
  }

}
