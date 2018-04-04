import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';

import { User } from '../../providers/providers';
import { MainPage } from '../pages';
import {SignupFormModel} from "../../models/signup-form-model";
import {HelpersProvider} from "../../providers/helpers/helpers";

@IonicPage()
@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html'
})
export class SignupPage {
  // The account fields for the login form.
  // If you're using the username field with or without email, make
  // sure to add it to the type
  account: SignupFormModel = {
    name: 'Test Human',
    email: 'test@example.com',
    password: 'testtest'
  };

  constructor(public navCtrl: NavController,
    public user: User,
    public helpers: HelpersProvider) { }

  async doSignup(): Promise<void> {
    const loader = this.helpers.createLoader();
    await loader.present();
    this.user.signup(this.account)
      .then(resp => {
        loader.dismiss()
          .then(() => this.navCtrl.push(MainPage));
      })
      .catch(err => {
        loader.dismiss().then(() => this.helpers.displayErrorAlert(err));
      });
  }
}
