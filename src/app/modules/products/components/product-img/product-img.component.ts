import { Component, Input } from '@angular/core';
import { NavController, ModalController } from '@ionic/angular';

import { ProductPreviewComponent } from '../product-preview/product-preview.component';

import { Product } from './../../../shared/models/product';

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
      component: ProductPreviewComponent,
      componentProps: {
        'product': this.product
      }
    });

    await modal.present();
  }
}