/**
 * Created by tc949 on 2017/1/17.
 */
import {NgModule}             from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {Page404Component} from "./routers/page404/page404.component";
import {AuthLoginComponent} from "./routers/auth-login/auth-login.component";
import {HomeComponent} from "./routers/home/home.component";
import {ClientValidateService} from "./service/client-validate.service";

const appRoutes: Routes = [
  {path: '', redirectTo: 'index.html', pathMatch: 'full'},
  {path: 'index.html', component: HomeComponent},
  {path: 'oauth/login', component: AuthLoginComponent, canActivate: [ClientValidateService]},
  {path: '**', component: Page404Component}
];
@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class AppRouter {
}
