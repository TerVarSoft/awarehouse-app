import { Component, Input } from '@angular/core';
import { NavController } from 'ionic-angular';

import { ProductPreviewPage } from '../product-preview/product-preview';

import { Product } from '../../../models/product';

@Component({
  selector: 'product-img',
  templateUrl: 'product-img.component.html'
})
export class ProductImgComponent {

  @Input() product: Product;

  constructor(public navCtrl: NavController) { }

  openImage(event) {
    event.stopPropagation();

    this.navCtrl.push(ProductPreviewPage, {
      product: this.product
    });
  }
}