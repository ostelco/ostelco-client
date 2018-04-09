import 'rxjs/add/operator/toPromise';

import { Injectable } from '@angular/core';

import {PanaceaApiProvider} from "../panacea-api/panacea-api";
import {AngularFireAuth} from "angularfire2/auth";
import {SignupFormModel} from "../../models/signup-form-model";
import {UserProfileModel} from "../../models/user-profile-model";
import {ReplaySubject} from "rxjs/ReplaySubject";
import {NavController} from "ionic-angular";

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
  profile: UserProfileModel;
  authenticated: boolean = false;

  constructor(public papi: PanaceaApiProvider, public afAuth: AngularFireAuth) {
    this.afAuth.authState.take(1).subscribe(user => {
      if (user) {
        this.papi.getUserProfileById(user.uid)
          .then((profile: UserProfileModel) => this._loggedIn(profile))
          .catch(err => {
            console.log(`Unhandled error: ${err.message}`);
            console.error(err);
            this.authenticated = false;
          })
      } else {
        this.authenticated = false;
      }
    })
  }

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
    this.profile = null;
    this.authenticated = false;
    await this.afAuth.auth.signOut();
  }

  /**
   * Process a login/signup response to store user data
   */
  _loggedIn(resp: UserProfileModel): void {
    this.profile = resp;
    this.authenticated = true;
    // this.authNotifier.next(true);
  }

  isAuthenticated(nav: NavController): boolean {
    if (this.authenticated) {
      return true
    } else {
      setTimeout(() => { nav.setRoot("LoginPage") }, 0);
      return true
    }
  }
}
