import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';

import { Settings } from './settings';
import { TunariStorage } from './tunari-storage';

/**
 * Settings Cache provider. 
 */
@Injectable()
export class SettingsCache {

  settings: any;

  constructor(public settingsProvider: Settings,
    public storage: TunariStorage) {
  }

  getImgServerUrl(): string {
    return this.settings.filter(setting => setting.key === 'imgServer')[0].value;
  }

  getProductCategoriesWithAll(): any[] {
    return [{ id: '', name: 'Todas' }, ...this.settings.productCategories];
  }

  getProductTypesWithAll(categoryId: string): any[] {
    return [{ id: '', name: 'Todos' }, ...this.getProductTypes(categoryId)];
  }

  getProductCategories(): any[] {
    return this.settings.productCategories;
  }

  getProductTypes(categoryId: string): any[] {
    const filteredTypes = categoryId ?
      this.settings.productTypes.filter(type => type.categoryId === categoryId) :
      [];

    return filteredTypes;
  }

  getProductPrices(categoryId: string, typeId: string): any[] {
    if (!categoryId && !typeId) {
      return this.settings.productPrices;
    }

    let assignedPrices = typeId ?
      this.settings.productTypes
        .find(type => (type.id === typeId && type.categoryId === categoryId)).prices :
      this.settings.productCategories.find(category => category.id === categoryId).prices;

    return assignedPrices;
  }

  getInvitationTypes(): string[] {
    return this.settings.filter(setting => setting.key === 'invitationTypes')[0].value;
  }

  loadFromStorage() {
    console.log('loading sotrage')
    return this.storage.getSettings().then(settings => {
      console.log(settings)
      this.setSettings(settings);
      return settings;
    });
  }

  setSettings(settings: any) {
    this.settings = settings;
    this.storage.setSettings(settings);
  }
}