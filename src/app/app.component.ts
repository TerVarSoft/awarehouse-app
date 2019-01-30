import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router'

import { Platform, NavController, MenuController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { Network } from "@ionic-native/network";
import { Events } from '@ionic/angular';

import * as moment from 'moment';

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

  constructor(
    public platform: Platform,
    statusBar: StatusBar,
    private router: Router,
    // public network: Network,
    splashScreen: SplashScreen,
    public storage: TunariStorage,
    public messages: TunariMessages,
    public notifier: TunariNotifier,
    public connection: Connection,
    public events: Events,
    private menu: MenuController
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

      this.events.subscribe('user:logout', () => {
        this.onLogout();
      });
    });
  }

  onViewChange(view) {
    switch (view) {
      case "inventory":
        this.router.navigate(['/products']);
        break;
      case "sellings":
        this.router.navigate(['/sellings']);
        break;
      default:
        this.router.navigate(['/products']);
    }

    this.menu.close();
  }



  onLogout() {
    this.menu.close();
    this.storage.removeStorage();
    this.router.navigate(['/']);
  }
}
