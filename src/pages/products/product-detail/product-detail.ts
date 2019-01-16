import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { ProductUpdatePage } from '../product-update/product-update';

import { Product } from '../../../models/product';

import { ProductsUtil } from './../products-util';
import { SettingsCache } from '../../../providers/settings-cache';

@Component({
  selector: 'product-detail',
  templateUrl: 'product-detail.html',
  providers: [ProductsUtil]
})
export class ProductDetailPage {

  segment = 'prices';

  product: Product;

  productPrices: any[];

  constructor(public navParams: NavParams,
    public navCtrl: NavController,
    public settingsProvider: SettingsCache) {
    this.product = this.navParams.data.product;
    this.productPrices = this.settingsProvider.getProductPrices(
      this.product.categoryId, this.product.typeId);

    const newPrices = this.productPrices.map(priceType => {
      const productPrice = this.product.prices.find(price => price.priceId === priceType.id);
      return {
        priceId: priceType.id,
        name: priceType.name,
        value: productPrice ? productPrice.value : 0
      }
    });

    this.product.prices = newPrices;
  }

  editProduct() {
    this.navCtrl.push(ProductUpdatePage, {
      product: this.product
    });
  }
}