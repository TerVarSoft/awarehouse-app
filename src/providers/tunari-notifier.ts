import { Injectable } from '@angular/core';
import { LoadingController, ToastController } from '@ionic/angular';

/**
 * Notifications service helper. 
 */
@Injectable()
export class TunariNotifier {

  constructor(public loadingCtrl: LoadingController,
    private toastCtrl: ToastController) { }

  async createToast(message: string) {
    let toast = await this.toastCtrl.create({
      message: message,
      duration: 2000,
      position: 'bottom'
    });

    toast.present();
    return toast;
  }

  async createLoader(message: string) {
    let loader = await this.loadingCtrl.create();
    // loader.setContent(message);
    loader.present();

    return loader;
  }
}