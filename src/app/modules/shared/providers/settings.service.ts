import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';

import { ApiService } from './api.service';

/**
 * Settings endpoint provider. 
 */
@Injectable()
export class SettingsService {

  baseUrl: string;

  endpoint: string = "settings";

  constructor(public api: ApiService) {}

  get() {
    return this.api.get(this.endpoint);
  }  
}