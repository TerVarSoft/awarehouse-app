import { RequestOptions, URLSearchParams } from '@angular/http';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';

import { TunariApi } from './tunari-api';

/**
 * Sellings endpoint provider. 
 */
@Injectable()
export class Transactions {

  baseUrl: string;

  endpoint: string = "transactions";

  constructor(public api: TunariApi) { }

  get() {
    return this.api.get(this.endpoint);
  }

  getByDate(date: Date) {
    let params: URLSearchParams = new URLSearchParams();
    params.set('createdAt', String(date));
    let requestOptions = new RequestOptions({ search: params });

    return this.api.get(this.endpoint, requestOptions);
  }

  save(selling) {
    if (selling.id) {
      return this.put(selling);
    } else {
      return this.post(selling);
    }
  }

  post(selling) {
    return this.api.post(this.endpoint, selling);
  }

  put(selling) {
    return this.api.put(`${this.endpoint}/${selling.id}`, selling);
  }

  remove(selling, shouldUpdateQuantity: boolean) {
    let params: URLSearchParams = new URLSearchParams();
    params.set('shouldUpdateQuantity', String(shouldUpdateQuantity));
    let requestOptions = new RequestOptions({ search: params });

    return this.api.remove(`${this.endpoint}/${selling.id}`, requestOptions);
  }
}