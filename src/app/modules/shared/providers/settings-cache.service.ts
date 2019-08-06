import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';

import { SettingsService } from './settings.service';
import { StorageService } from './storage.service';

/**
 * Settings Cache provider. 
 */
@Injectable()
export class SettingsCacheService {

  settings: any = {};

  constructor(public settingsProvider: SettingsService,
    public storage: StorageService) {
  }

  loadFromStorage() {
    return this.storage.getSettings().then(settings => {
      this.setSettings(settings);
      return settings;
    });
  }

  setSettings(settings: any) {
    this.settings = settings;
    this.storage.setSettings(settings);
  }
}