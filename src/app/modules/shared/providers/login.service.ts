import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';

import { ApiService } from './api.service';

/**
 * Login endpoint provider. 
 */
@Injectable()
export class LoginService {

  baseUrl: string;

  endpoint: string = "auth";

  constructor(public api: ApiService) {
    this.baseUrl = this.api.baseUrl;
  }

  post(userName: string, password: string) {    

    return this.api.postPromise(this.endpoint, { 
      userName: userName,
      password: password
    });
  }
}