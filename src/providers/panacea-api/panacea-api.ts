import { Injectable } from '@angular/core';
import {AngularFirestore} from "angularfire2/firestore";

@Injectable()
export class PanaceaApiProvider {

  constructor(public afs: AngularFirestore) {

  }

  async getUserProfileById(id: string): Promise<UserProfileModel> {
    return this.afs.doc(`user-profiles/${id}`).valueChanges().take(1).toPromise();
  }
}
