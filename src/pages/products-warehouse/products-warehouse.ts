import { Component } from '@angular/core';

import { Products } from '../../providers/products';

import { Product } from '../../models/product';

@Component({
    selector: 'products-warehouse',
    templateUrl: 'products-warehouse.html'
})
export class ProductsWarehousePage {
    private productsLowQuantity: Product[];

    constructor(public productsProvider: Products) {}

    ionViewWillEnter() {
        this.productsProvider.getLowQuantity()
        .subscribe(productsObject => {
            this.productsLowQuantity = productsObject.items;
        });
    }
}
