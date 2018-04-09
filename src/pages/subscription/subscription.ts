import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {User} from "../../providers/user/user";
import {PanaceaApiProvider} from "../../providers/panacea-api/panacea-api";
import {UserProfileModel} from "../../models/user-profile-model";
import {HelpersProvider} from "../../providers/helpers/helpers";
import {OfferModel} from "../../models/offer-model";

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
  offers: OfferModel[] = [];

  constructor(public navCtrl: NavController, public navParams: NavParams, public papi: PanaceaApiProvider, public user: User, public helpers: HelpersProvider) { }

  async refresh() {
    console.log(this.profile);
    const loader = this.helpers.createLoader();
    await loader.present();
    try {
      this.profile = await this.papi.getUserProfileById(this.user.profile.id);
      this.offers = this.profile.subscription.offers || [];
      await loader.dismiss();
    } catch (err) {
      await loader.dismiss();
      this.helpers.displayErrorAlert(err);
    }
  }

  ionViewDidEnter(): void {
    this.refresh();
  }

  ionViewCanEnter(): boolean {
    return this.user.isAuthenticated(this.navCtrl);
  }
}
