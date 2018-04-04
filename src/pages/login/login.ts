import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';

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

  constructor(public navCtrl: NavController,
    public user: User,
    public helpers: HelpersProvider) { }

  // Attempt to login in through our User service
  async doLogin(): Promise<void> {
    const loader = this.helpers.createLoader();
    await loader.present();
    this.user.login(this.account).then((resp) => {
      return loader.dismiss()
        .then(() => this.navCtrl.setRoot(MainPage));
    }).catch( (err) => {
      loader.dismiss()
        .then(() => this.helpers.displayErrorAlert(err));
    });
  }
}
