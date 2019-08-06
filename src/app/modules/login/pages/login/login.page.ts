import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router'
import { NavController } from '@ionic/angular';

import { LoginService } from '../../../shared/providers/login.service';
import { SettingsCacheService } from '../../../shared/providers/settings-cache.service';
import { MessagesService } from '../../../shared/providers/messages.service';
import { NotifierService } from '../../../shared/providers/notifier.service';
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
    public settingsProvider: SettingsCacheService,
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

  async onLogin(form: NgForm) {
    this.submitted = true;

    if (form.valid) {
      let loader = await this.notifier.createLoader(this.messages.authenticating);

      let loginResponse: UserToken;
      try {
        loginResponse = await this.loginService.post(this.login.username, this.login.password);
      } catch (exception) {
        const errorResponse = JSON.parse(exception._body);

        if (errorResponse.status === 401 && errorResponse.code === 1) {
          this.notifier.createToast(this.messages.notAuthenticated);
        }

        loader.dismiss();
        return;
      }

      if (loginResponse.role === 0) {
        this.storage.setAuthToken(loginResponse.authToken).then(() => {
          console.log("Token Authentication has been provided by the server");
          this.settingsProvider.setSettings(loginResponse.settings);
          loader.dismiss();

          this.router.navigate(['/products']);
        });
      } else {        
        loader.dismiss();
        this.notifier.createToast(this.messages.notAdminUser);
      }
    }
  }

  private loadConfiguration() {
    console.log("Loading settings from storages...");
    this.settingsProvider.loadFromStorage().then(settings => {
      if (settings) {
        console.log("Settings loaded from local storage...");
        this.navCtrl.navigateRoot('/products');
      }
    });
  }
}
