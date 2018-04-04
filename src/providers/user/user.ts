import 'rxjs/add/operator/toPromise';

import { Injectable } from '@angular/core';

import {PanaceaApiProvider} from "../panacea-api/panacea-api";
import {AngularFireAuth} from "angularfire2/auth";
import {SignupFormModel} from "../../models/signup-form-model";

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

  constructor(public papi: PanaceaApiProvider, public afAuth: AngularFireAuth) { }

  /**
   * Send a POST request to our login endpoint with the data
   * the user entered on the form.
   */
  async login(accountInfo: LoginFormModel): Promise<UserProfileModel> {
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
      throw new Error(`Unknown error. Login method returned: ${result}`);
    }
  }

  /**
   * Send a POST request to our signup endpoint with the data
   * the user entered on the form.
   */
  async signup(accountInfo: SignupFormModel): Promise<UserProfileModel|null> {
    const result = await this.afAuth.auth.createUserAndRetrieveDataWithEmailAndPassword(accountInfo.email, accountInfo.password);
    if (result && result.user) {
      const profile = await this.papi.createUserProfile(result.user.uid, {
        id: result.user.uid,
        email: result.user.email,
        name: accountInfo.name
      });

      if (profile) {
        this._loggedIn(profile);
        return profile;
      } else {
        throw new Error(`Unknown error. Create user profile method returned: ${result}`);
      }
    } else {
      throw new Error(`Unknown error. Signup method returned: ${result}`);
    }
  }

  /**
   * Log the user out, which forgets the session
   */
  async logout(): Promise<void> {
    this._user = null;
    await this.afAuth.auth.signOut();
  }

  /**
   * Process a login/signup response to store user data
   */
  _loggedIn(resp: UserProfileModel): void {
    this._user = resp;
  }
}
