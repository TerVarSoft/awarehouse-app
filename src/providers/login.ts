import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';

import { TunariApi } from './tunari-api';

/**
 * Login endpoint provider. 
 */
@Injectable()
export class Login {

  baseUrl: string;

  endpoint: string = "auth";

  constructor(public api: TunariApi) {
    this.baseUrl = this.api.baseUrl;
  }

  post(userName: string, password: string) {    

    return this.api.post(this.endpoint, { 
      userName: userName,
      password: password
    });
  }
}