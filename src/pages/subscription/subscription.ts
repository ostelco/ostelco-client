import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {User} from "../../providers/user/user";
import {PanaceaApiProvider} from "../../providers/panacea-api/panacea-api";
import {UserProfileModel} from "../../models/user-profile-model";
import {HelpersProvider} from "../../providers/helpers/helpers";
import {OfferModel} from "../../models/offer-model";
import {STRIPE_PUBLISHABLE_API_KEY} from "../../config/config";
import {TranslateService} from "@ngx-translate/core";

declare var StripeCheckout: any;

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

  TRANSLATION_KEYS = ['STRIPE_TITLE', 'STRIPE_DESCRIPTION', 'STRIPE_SUCCESS_MESSAGE'];
  translationValues = {} as any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public papi: PanaceaApiProvider, public user: User, public helpers: HelpersProvider, private translate: TranslateService) {
    this.translate.get(this.TRANSLATION_KEYS).subscribe(values => this.translationValues = values);
  }

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

  ionViewCanEnter(): boolean | Promise<any> {
    return this.user.isAuthenticated(this.navCtrl);
  }

  onOfferClick(offer): void {

    const handler = StripeCheckout.configure({
      key: STRIPE_PUBLISHABLE_API_KEY,
      image: 'https://goo.gl/EJJYq8', // TODO: Update image shown in payment dialog
      locale: this.translate.getBrowserLang(),
      token: token => {
        this.helpers.displayMessage(this.translationValues.STRIPE_SUCCESS_MESSAGE)
      }
    });

    handler.open({
      name: this.translationValues.STRIPE_TITLE,
      // excerpt: "TITLE_LABEL", Not sure what this is for righ now
      amount: offer.value,
      email: this.profile.email,
      currency: offer.currency,
      description: this.translationValues.STRIPE_DESCRIPTION
    });
  }
}
