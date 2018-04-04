import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {User} from "../../providers/user/user";
import {PanaceaApiProvider} from "../../providers/panacea-api/panacea-api";
import {UserProfileModel} from "../../models/user-profile-model";
import {HelpersProvider} from "../../providers/helpers/helpers";

/**
 * Generated class for the SubscriptionPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-subscription',
  templateUrl: 'subscription.html',
})
export class SubscriptionPage {

  profile: UserProfileModel;

  constructor(public navCtrl: NavController, public navParams: NavParams, public papi: PanaceaApiProvider, public user: User, public helpers: HelpersProvider) { }

  async refresh() {
    const loader = this.helpers.createLoader();
    await loader.present();
    this.papi.getUserProfileById(this.user.profile.id)
      .then(profile => {
        this.profile = profile;
        loader.dismiss()
      })
      .catch(err => {
        loader.dismiss()
          .then(() => {
            this.helpers.displayErrorAlert(err);
          });
      })
  }

  ionViewDidEnter(): void {
    this.refresh();
  }

  ionViewCanEnter(): boolean | Promise<any> {
    return this.user.isAuthenticated(this.navCtrl);
  }
}
