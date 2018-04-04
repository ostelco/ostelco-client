import { Injectable } from '@angular/core';
import {AngularFirestore} from "angularfire2/firestore";
import {UserProfileModel} from "../../models/user-profile-model";

@Injectable()
export class PanaceaApiProvider {

  constructor(public afs: AngularFirestore) { }

  async getUserProfileById(id: string): Promise<UserProfileModel> {
    return this.afs.doc(`user-profiles/${id}`).valueChanges().take(1).toPromise()
      .then((profile: UserProfileModel) => {
        return profile;
      });
  }

  async createUserProfile(id: string, values: UserProfileModel): Promise<UserProfileModel> {
    return this.afs.doc(`user-profiles/${id}`).set(values).then(() => values);
  }
}
