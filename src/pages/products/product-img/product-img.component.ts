import { Component, Input } from '@angular/core';
import { NavController, ModalController } from '@ionic/angular';

import { ProductPreviewPage } from '../product-preview/product-preview';

import { Product } from '../../../models/product';

@Component({
  selector: 'product-img',
  templateUrl: 'product-img.component.html'
})
export class ProductImgComponent {

  @Input() product: Product;

  constructor(private modalController: ModalController) { }

  async openImage(event) {    
    event.stopPropagation();

    const modal = await this.modalController.create({
      component: ProductPreviewPage,
      componentProps: {
        'product': this.product
      }
    });

    await modal.present();
  }
}