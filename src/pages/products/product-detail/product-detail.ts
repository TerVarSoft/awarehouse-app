import { Component } from '@angular/core';
import { NavController, NavParams, ModalController } from '@ionic/angular';

import { ProductUpdatePage } from '../product-update/product-update';

import { Product } from '../../../models/product';

import { ProductsUtil } from './../products-util';
import { SettingsCache } from '../../../providers/settings-cache';

@Component({
  selector: 'product-detail',
  templateUrl: 'product-detail.html',
  styleUrls: ['product-detail.scss'],
  providers: [ProductsUtil]
})
export class ProductDetailPage {

  segment = 'prices';

  product: Product;

  productPrices: any[];

  constructor(public navParams: NavParams,
    private modalCtrl: ModalController,
    public navCtrl: NavController,
    public settingsProvider: SettingsCache) {
    this.initProperties();
  }

  async initProperties() {
    this.product = this.navParams.data.product;
    this.productPrices = await this.settingsProvider.getProductPrices(
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

  async editProduct() {
    // this.navCtrl.push(ProductUpdatePage, {
    //   product: this.product
    // });

    const createProductModal = await this.modalCtrl.create({
      component: ProductUpdatePage,
      componentProps: {
        product: this.product
      }
    });

    createProductModal.present();
  }

  closePreview() {
    this.modalCtrl.dismiss();
  }
}