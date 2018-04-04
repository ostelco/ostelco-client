import {SubscriptionModel} from "./SubscriptionModel";

export interface UserProfileModel {
  email: string;
  id: string;
  name: string;
  subscription: SubscriptionModel;
}
