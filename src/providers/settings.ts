import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';

import { TunariApi } from './tunari-api';

/**
 * Settings endpoint provider. 
 */
@Injectable()
export class Settings {

  baseUrl: string;

  endpoint: string = "settings";

  constructor(public api: TunariApi) {}

  get() {
    return this.api.get(this.endpoint);
  }  
}