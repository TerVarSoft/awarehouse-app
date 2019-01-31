import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router'
import { NavController } from '@ionic/angular';

import { LoginService } from '../../../shared/providers/login.service';
import { SettingsCache } from '../../../shared/providers/settings-cache.service';
import { MessagesService } from '../../../shared/providers/messages.service';
import { NotifierService } from '../../../shared/providers/tunari-notifier.service';
import { StorageService } from '../../../shared/providers/storage.service';

import { UserToken } from './../../../shared/models/user-token';

@Component({
  selector: 'page-login',
  templateUrl: 'login.page.html',
  styleUrls: ['login.page.scss'],
})
export class LoginPage {
  login: { username?: string, password?: string } = {};
  submitted: boolean = false;
  isLoggedIn: boolean = true;

  constructor(public navCtrl: NavController,
    private router: Router,
    public loginService: LoginService,
    public settingsProvider: SettingsCache,
    public notifier: NotifierService,
    public storage: StorageService,
    public messages: MessagesService) {
    this.storage.getAuthtoken().then(token => {
      if (!token) {
        this.isLoggedIn = false;
      } else {
        this.loadConfiguration();
      }
    });
  }

  // async onLogin(form: NgForm) {
  //   this.submitted = true;

  //   if (form.valid) {
  //     let loader = await this.notifier.createLoader(this.messages.authenticating);
  //     this.loginService.post(this.login.username, this.login.password)
  //       .subscribe(resp => {
  //         const userToken: UserToken = resp;
  //         if (userToken.role === 0) {
  //           this.storage.setAuthToken(userToken.authToken).then(() => {
  //             console.log("Token Authentication has been provided by the server");
  //             this.settingsProvider.setSettings(userToken.settings);
  //             loader.dismiss();
  //             // this.navCtrl.setRoot(ProductsPage);
  //           });
  //         } else {
  //           // loader.dismiss();
  //           this.notifier.createToast(this.messages.notAdminUser);
  //         }
  //       }, error => {
  //         // loader.dismiss();
  //         this.notifier.createToast(this.messages.invalidUser);
  //       });
  //   }
  // }

  async onLogin(form: NgForm) {
    this.submitted = true;

    if (form.valid) {
      let loader = await this.notifier.createLoader(this.messages.authenticating);
      const loginResponse = await this.loginService.post(this.login.username, this.login.password);

      const userToken: UserToken = loginResponse;
      if (userToken.role === 0) {
        this.storage.setAuthToken(userToken.authToken).then(() => {
          console.log("Token Authentication has been provided by the server");
          this.settingsProvider.setSettings(userToken.settings);
          loader.dismiss();

          this.router.navigate(['/products']);
          // this.navCtrl.setRoot(ProductsPage);
        });
      } else {
        // loader.dismiss();
        this.notifier.createToast(this.messages.notAdminUser);
      }
    }
    // }, error => {
    //   // loader.dismiss();
    //   this.notifier.createToast(this.messages.invalidUser);
    // });

  }

  private loadConfiguration() {
    console.log("Loading settings from storages...");
    this.settingsProvider.loadFromStorage().then(settings => {
      if (settings) {
        console.log("Settings loaded from local storage...");
        // this.router.navigate(['/products']);
        this.navCtrl.navigateRoot('/products');
      }
    });
  }
}
