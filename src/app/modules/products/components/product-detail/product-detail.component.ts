import { Component } from '@angular/core';
import { NavController, NavParams, ModalController } from '@ionic/angular';

import { ProductUpdateComponent } from '../product-update/product-update.component';

import { Product } from './../../..//shared/models/product';

import { ProductsUtil } from './../../products.util';

@Component({
  selector: 'product-detail',
  templateUrl: 'product-detail.component.html',
  styleUrls: ['product-detail.component.scss'],
  providers: [ProductsUtil]
})
export class ProductDetailComponent {

  segment = 'prices';

  product: Product;

  productPrices: any[];

  constructor(public navParams: NavParams,
    private modalCtrl: ModalController,
    public navCtrl: NavController) {
    this.initProperties();
  }

  async initProperties() {
    this.product = this.navParams.data.product;

    // No use of settingsProvider
    // this.productPrices = await this.settingsProvider.getProductPrices(
    //   this.product.categoryId, this.product.typeId);

    // const newPrices = this.productPrices.map(priceType => {
    //   const productPrice = this.product.prices.find(price => price.priceId === priceType.id);
    //   return {
    //     priceId: priceType.id,
    //     name: priceType.name,
    //     value: productPrice ? productPrice.value : 0
    //   }
    // });

    // this.product.prices = newPrices;
  }

  async editProduct() {
    // this.navCtrl.push(ProductUpdatePage, {
    //   product: this.product
    // });

    const createProductModal = await this.modalCtrl.create({
      component: ProductUpdateComponent,
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