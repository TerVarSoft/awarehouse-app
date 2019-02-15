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

  getImgServerUrl(): string {
    return this.settings.filter(setting => setting.key === 'imgServer')[0].value;
  }

  async getProductCategoriesWithAll() {
    if (!this.settings.productCategories) await this.loadFromStorage();

    return [{ id: '', name: 'Todas' }, ...this.settings.productCategories];
  }

  async getProductTypesWithAll(categoryId: string) {
    if (!this.settings.productTypes) await this.loadFromStorage();

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

  async getProductPricesWithOptionalProductPrices(categoryId: string, typeId: string) {
    return [...(await this.getProductPrices(categoryId, typeId)), ...(await this.getOptionalProductPrices(categoryId, typeId))];
  }

  async getProductPrices(categoryId: string, typeId: string) {
    if (!this.settings.productPrices) await this.loadFromStorage();

    if (!categoryId && !typeId) {
      return this.settings.productPrices || [];
    }

    let assignedPrices = typeId ?
      this.settings.productTypes
        .find(type => (type.id === typeId && type.categoryId === categoryId)).prices :
      this.settings.productCategories.find(category => category.id === categoryId).prices;

    return assignedPrices || [];
  }

  async getOptionalProductPrices(categoryId: string, typeId: string) {
    if (!this.settings.productPrices) await this.loadFromStorage();

    if (!categoryId && !typeId) {
      return [];
    }

    let assignedPrices = typeId ?
      this.settings.productTypes
        .find(type => (type.id === typeId && type.categoryId === categoryId)).optionalPrices :
      this.settings.productCategories.find(category => category.id === categoryId).optionalPrices;
      
    return assignedPrices || [];
  }

  getInvitationTypes(): string[] {
    return this.settings.filter(setting => setting.key === 'invitationTypes')[0].value;
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