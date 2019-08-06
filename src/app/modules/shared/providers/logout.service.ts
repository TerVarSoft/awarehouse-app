import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';

import { ApiService } from './api.service';

/**
 * Login endpoint provider. 
 */
@Injectable()
export class LogoutService {

    baseUrl: string;

    endpoint: string = "logout";

    constructor(public api: ApiService) {
        this.baseUrl = this.api.baseUrl;
    }

    post() {
        return this.api.postPromise(this.endpoint, {});
    }
}