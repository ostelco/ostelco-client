import { Injectable } from '@angular/core';
import {AlertController, LoadingController} from "ionic-angular";
import {Loading} from "ionic-angular/components/loading/loading";
import {TranslateService} from "@ngx-translate/core";

@Injectable()
export class HelpersProvider {

  TRANSLATION_KEYS = ['ERROR', 'OK', 'INFO'];
  translationValues = {} as any;

  constructor(public alertCtrl: AlertController, public loadingCtrl: LoadingController, private translate: TranslateService) {
    this.translate.get(this.TRANSLATION_KEYS).subscribe(values => this.translationValues = values);
  }

  displayErrorAlert(error: Error): void {
    let alert = this.alertCtrl.create({
      title: this.translationValues.ERROR,
      message: error.message,
      buttons: [{
        text: this.translationValues.OK,
      }]
    });
    alert.present();
  }

  createLoader(): Loading {
    return this.loadingCtrl.create();
  }

  displayMessage(message: string): void {
    let alert = this.alertCtrl.create({
      title: this.translationValues.INFO,
      message,
      buttons: [{
        text: this.translationValues.OK
      }]
    });
    alert.present();
  }
}
