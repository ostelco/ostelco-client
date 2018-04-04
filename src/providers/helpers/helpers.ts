import { Injectable } from '@angular/core';
import {AlertController, LoadingController} from "ionic-angular";
import {Loading} from "ionic-angular/components/loading/loading";

@Injectable()
export class HelpersProvider {

  constructor(public alertCtrl: AlertController, public loadingCtrl: LoadingController) {
    console.log('Hello HelpersProvider Provider');
  }

  displayErrorAlert(error: Error): void {
    let alert = this.alertCtrl.create({
      title: 'Error',
      message: error.message,
      buttons: [{
        text: 'Ok'
      }]
    });
    alert.present();
  }

  createLoader(): Loading {
    return this.loadingCtrl.create();
  }
}
