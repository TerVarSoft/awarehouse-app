import { Component, ViewChild } from '@angular/core';

import { Platform, NavController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { Network } from "@ionic-native/network";
import { Events } from '@ionic/angular';

import * as moment from 'moment';

import { LoginPage } from '../pages/login/login';
import { ProductsTabsPage } from '../pages/products-tabs/products-tabs';
import { ProductsSellingsPage } from '../pages/products-sellings/products-sellings';

import { Connection } from '../providers/connection';
import { TunariMessages } from '../providers/tunari-messages';
import { TunariNotifier } from '../providers/tunari-notifier';
import { TunariStorage } from '../providers/tunari-storage';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {

  @ViewChild('rootNavController') navCtrl: NavController;

  rootPage: any = LoginPage;
  
  constructor(
    public platform: Platform,
    statusBar: StatusBar,
    // public network: Network,
    splashScreen: SplashScreen,
    public storage: TunariStorage,
    public messages: TunariMessages,
    public notifier: TunariNotifier,
    public connection: Connection,
    public events: Events
  ) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();

      moment.locale('es');

      // this.network.onDisconnect().subscribe(() => {
      //   this.notifier.createToast(this.messages.noInternetError);
      // });

      // this.network.onConnect().subscribe(() => {
      //   this.notifier.createToast(this.messages.connectedToInternet);
      // });

      // if (!connection.isConnected()) {
      //   this.notifier.createToast(this.messages.noInternetError);
      // }

      // this.events.subscribe('user:logout', () => {
      //   this.onLogout();
      // });
    });
  }

  // onViewChange(view) {
  //   switch (view) {
  //     case "inventory":
  //       this.navCtrl.setRoot(ProductsTabsPage);
  //       break;
  //     case "sellings":
  //       this.navCtrl.setRoot(ProductsSellingsPage);
  //       break;
  //     default:
  //       this.navCtrl.setRoot(ProductsTabsPage);
  //   }
  // }



  // onLogout() {
  //   this.storage.removeStorage();
  //   this.navCtrl.setRoot(LoginPage);
  // }
}
