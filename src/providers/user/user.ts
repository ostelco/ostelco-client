import 'rxjs/add/operator/toPromise';

import { Injectable } from '@angular/core';

import { Api } from '../api/api';
import {PanaceaApiProvider} from "../panacea-api/panacea-api";
import {AngularFireAuth} from "angularfire2/auth";
import {HelpersProvider} from "../helpers/helpers";

/**
 * Most apps have the concept of a User. This is a simple provider
 * with stubs for login/signup/etc.
 *
 * This User provider makes calls to our API at the `login` and `signup` endpoints.
 *
 * By default, it expects `login` and `signup` to return a JSON object of the shape:
 *
 * ```json
 * {
 *   status: 'success',
 *   user: {
 *     // User fields your app needs, like "id", "name", "email", etc.
 *   }
 * }Ø
 * ```
 *
 * If the `status` field is not `success`, then an error is detected and returned.
 */
@Injectable()
export class User {
  _user: UserProfileModel;

  constructor(public api: Api, public papi: PanaceaApiProvider, public afAuth: AngularFireAuth) { }

  /**
   * Send a POST request to our login endpoint with the data
   * the user entered on the form.
   */
  async login(accountInfo: LoginFormModel): Promise<any> {
    const result = await this.afAuth.auth.signInWithEmailAndPassword(accountInfo.email, accountInfo.password);
    if (result) {
      const profile = await this.papi.getUserProfileById(result.uid);
      if (profile) {
        this._loggedIn(profile);
        return profile;
      } else {
        throw new Error('There is no user profile corresponding to this identifier. The user may have been deleted.');
      }
    } else {
      throw new Error('Unknown error. Login method returned: ${result}');
    }
  }

  /**
   * Send a POST request to our signup endpoint with the data
   * the user entered on the form.
   */
  signup(accountInfo: any) {
    let seq = this.api.post('signup', accountInfo).share();

    seq.subscribe((res: any) => {
      // If the API returned a successful response, mark the user as logged in
      if (res.status == 'success') {
        this._loggedIn(res);
      }
    }, err => {
      console.error('ERROR', err);
    });

    return seq;
  }

  /**
   * Log the user out, which forgets the session
   */
  logout() {
    this._user = null;
    this.afAuth.auth.signOut();
  }

  /**
   * Process a login/signup response to store user data
   */
  _loggedIn(resp: UserProfileModel) {
    this._user = resp;
  }
}
