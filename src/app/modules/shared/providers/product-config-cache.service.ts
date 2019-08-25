import { RequestOptions, URLSearchParams } from '@angular/http';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';

import * as _ from "lodash";

import { ApiService } from './api.service';
import { StorageService } from './storage.service';

/**
 * Product config cache endpoint provider. 
 */
@Injectable()
export class ProductConfigCacheService {

    endpoint: string = 'user-config-cache';

    constructor(public api: ApiService) { }

    async get() {
        let params: URLSearchParams = new URLSearchParams();
        params.set('properties', 'productCategories productTypesByCategory productPricesByCategoryAndType productLocationsByCategoryAndType productCategoryAndTypeFilters');

        let requestOptions = new RequestOptions({ search: params });

        const productConfigCache = await this.api.getPromise(this.endpoint, requestOptions);
        console.log(productConfigCache)
        return productConfigCache;
    }
}