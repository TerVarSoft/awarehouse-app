import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

/**
 * Tunari wrapper to access storage.
 */
@Injectable()
export class TunariStorage {

  private authTokenKey: string = "authToken";

  private settingsKey: string = "settings";

  private productFavoritesKey: string = "productFavorites";

  constructor(public storage: Storage) { }

  public getAuthtoken() {
    return this.getValue(this.authTokenKey);
  }

  public setAuthToken(value: string) {
    return this.setValue(this.authTokenKey, value);
  }

  public getSettings() {
    console.log('get keeys2');
    return this.getValue(this.settingsKey).then(settings => {
      return JSON.parse(settings);
    });
  }

  public setSettings(value: any) {
    console.log(value)
    this.setValue(this.settingsKey, JSON.stringify(value));
  }

  public getProductFavorites() {
    return this.getValue(this.productFavoritesKey).then(favorites => {
      return JSON.parse(favorites);
    });
  }

  public setProductFavorites(value: any) {
    this.setValue(this.productFavoritesKey, JSON.stringify(value));
  }

  public removeStorage() {
    this.storage.clear();
  }

  private getValue(key: string) {
    return this.storage.get(key);
  }

  private setValue(key: string, value: string) {
    return this.storage.set(key, value);
  }
}