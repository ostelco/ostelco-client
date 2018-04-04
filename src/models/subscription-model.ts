import {OfferModel} from "./offer-model";

export interface SubscriptionModel {
  usage: string;
  offers?: OfferModel[];
}
