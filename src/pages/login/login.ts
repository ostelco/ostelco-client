import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { IonicPage, NavController, ToastController } from 'ionic-angular';

import { User } from '../../providers/providers';
import { MainPage } from '../pages';
import {HelpersProvider} from "../../providers/helpers/helpers";

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {
  // The account fields for the login form.
  // If you're using the username field with or without email, make
  // sure to add it to the type
  account: LoginFormModel = {
    email: 'test@example.com',
    password: 'testtest'
  };

  // Our translated text strings
  private loginErrorString: string;

  constructor(public navCtrl: NavController,
    public user: User,
    public toastCtrl: ToastController,
    public helpers: HelpersProvider,
    public translateService: TranslateService) {

    this.translateService.get('LOGIN_ERROR').subscribe((value) => {
      this.loginErrorString = value;
    })
  }

  // Attempt to login in through our User service
  doLogin() {
    const loader = this.helpers.createLoader();
    loader.present();
    this.user.login(this.account).then((resp) => {
      loader.dismiss();
      this.navCtrl.push(MainPage);
    }).catch( (err) => {
      loader.dismiss();
      this.helpers.displayErrorAlert(err);
    });
  }
}
