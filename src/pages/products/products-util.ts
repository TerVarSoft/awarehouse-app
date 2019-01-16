import { Injectable } from '@angular/core';
import { AlertController, Alert } from 'ionic-angular';

import { SettingsCache } from '../../providers/settings-cache';

import { Product } from '../../models/product';

/**
 * Utility class for products endpoint provider. 
 */
@Injectable()
export class ProductsUtil {

  constructor(public alertCtrl: AlertController,
    private settingsProvider: SettingsCache) { }

  /* *Get Alert helper methods */

  getSelectPriceAlert(selectedProductCategory: string, selectedPrice: number): Alert {
    let productCategory =
      this.settingsProvider.getProductCategories().filter(category => category.name == selectedProductCategory)[0];

    let alert = this.alertCtrl.create();

    alert.setTitle('Precio');

    productCategory.priceTypes.forEach(priceType => {
      alert.addInput({
        type: 'radio',
        label: priceType.name,
        value: priceType.id,
        checked: selectedPrice === priceType.id
      });
    });

    alert.addButton('Cancel');

    return alert;
  }

  getAddPriceAlert(product: Product, selectedPriceType: any) {

    const priceToUpdate = product.prices.find(price => price.priceId === selectedPriceType.id);

    let alert = this.alertCtrl.create({
      title: product.name,
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
      title: product.name,
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

  getCreateSellingAlert(product: Product, selectedPriceId: string) {
    const selectedPrice = product.prices.find(price => price.priceId === selectedPriceId);
    let alert = this.alertCtrl.create({
      title: `Venta ${product.name}`,
      message: `${selectedPrice.name}: ${selectedPrice.value} Bs.`,
      inputs: [
        {
          name: 'quantity',
          type: 'number',
          placeholder: 'Especifica la cantidad!'
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

  getRemoveProductAlert(productName: string) {
    let alert = this.alertCtrl.create({
      title: 'Borrando!',
      message: `Estas Seguro de borrar el producto ${productName}`,
      buttons: [
        {
          text: 'Cancelar',
        }
      ]
    });

    return alert;
  }

  getProductCategoriesAlert(selectedCategory: any) {
    const categoryInputs = this.settingsProvider.getProductCategoriesWithAll()
      .map(category => ({
        label: category.name,
        value: category,
        type: 'radio',
        checked: selectedCategory.id === category.id
      }));

    let alert = this.alertCtrl.create({
      title: 'Categorias',
      message: 'Selecciona una categoria',
      inputs: categoryInputs,
      buttons: [
        {
          text: 'Cancel'
        }
      ]
    });

    return alert;
  }

  getProductTypesAlert(selectedCategory: any, selectedType: any) {
    console.log('')
    const typeInputs = this.settingsProvider.getProductTypesWithAll(selectedCategory.id)
      .map(type => ({
        label: type.name,
        value: type,
        type: 'radio',
        checked: selectedType.id === type.id
      }));

    let alert = this.alertCtrl.create({
      title: 'Tipos',
      message: 'Selecciona un tipo',
      inputs: typeInputs,
      buttons: [
        {
          text: 'Cancel'
        }
      ]
    });

    return alert;
  }

  getProductPricesAlert(selectedCategory: any, selectedType: any, selectedPrice: any) {
    console.log('')
    const priceInputs = this.settingsProvider.getProductPrices(selectedCategory.id, selectedType.id)
      .map(price => ({
        label: price.name,
        value: price,
        type: 'radio',
        checked: selectedPrice.id === price.id
      }));

    let alert = this.alertCtrl.create({
      title: 'Tipos',
      message: 'Selecciona un tipo',
      inputs: priceInputs,
      buttons: [
        {
          text: 'Cancel'
        }
      ]
    });

    return alert;
  }

  getPriceTypes(selectedProductCategory: string): any[] {
    // let productCategory =
    //   this.settingsProvider
    //   .getProductCategories()
    //   .filter(category => category.name == selectedProductCategory)[0];

    return [{}];
    // return productCategory.priceTypes;
  }

  getSelectedPriceText(selectedCategory: string, priceTypeId: number): string {
    // let priceName =
    //   this.settingsProvider
    //   .getProductCategories()
    //   .filter(category => category.name == selectedCategory)[0]
    //   .priceTypes[priceTypeId]
    //   .name;

    return '';
    // return priceName;
  }
}