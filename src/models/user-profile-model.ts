import {SubscriptionModel} from "./subscription-model";
import {OfferModel} from "./offer-model";

export interface UserProfileModel {
  email: string;
  id: string;
  name: string;
  subscription?: SubscriptionModel;
  offers?: OfferModel[];
}
