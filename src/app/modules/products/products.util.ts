import { Injectable, } from '@angular/core';
import { AlertController } from '@ionic/angular';

import { SettingsCacheService } from './../shared/providers/settings-cache.service';

import { Product } from '../shared/models/product';

/**
 * Utility class for products endpoint provider. 
 */
@Injectable()
export class ProductsUtil {

  constructor(public alertCtrl: AlertController) { }

  getAddPriceAlert(product: Product, selectedPriceType: any) {

    const priceToUpdate = product.prices.find(price => price.priceId === selectedPriceType.id);

    let alert = this.alertCtrl.create({
      header: product.code,
      message: selectedPriceType.name,
      inputs: [
        {
          name: 'price',
          type: 'number',
          placeholder: 'Agrega un precio!',
          value: "" + (priceToUpdate ? priceToUpdate.value : "")
        },
      ],
      buttons: [
        {
          text: 'Cancel'
        }
      ]
    });

    return alert;
  }

  getAddQuantityAlert(product: Product) {
    let alert = this.alertCtrl.create({
      header: product.code,
      message: "Cantidad",
      inputs: [
        {
          name: 'quantity',
          type: 'number',
          placeholder: 'Especifica la cantidad!',
          value: "" + product.quantity
        },
      ],
      buttons: [
        {
          text: 'Cancel'
        }
      ]
    });

    return alert;
  }

  getRemoveProductAlert(productCode: string) {
    let alert = this.alertCtrl.create({
      header: 'Borrando!',
      message: `Estas Seguro de borrar el producto ${productCode}`,
      buttons: [
        {
          text: 'Cancelar',
        }
      ]
    });

    return alert;
  }
}