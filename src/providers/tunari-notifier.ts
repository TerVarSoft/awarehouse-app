import { Injectable } from '@angular/core';
import { LoadingController, Loading, ToastController, Toast } from 'ionic-angular';

/**
 * Notifications service helper. 
 */
@Injectable()
export class TunariNotifier {  

  constructor(public loadingCtrl: LoadingController,
    private toastCtrl: ToastController) {}

  createToast(message: string): Toast {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 2000,
      position: 'bottom'      
    });

    toast.present();
    return toast;
  }

  createLoader(message: string): Loading {
    let loader = this.loadingCtrl.create();  
    loader.setContent(message);
    loader.present();

    return loader;
  }  
}