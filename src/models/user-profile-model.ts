import {SubscriptionModel} from "./subscription-model";

export interface UserProfileModel {
  email: string;
  id: string;
  name: string;
  subscription?: SubscriptionModel;
}
