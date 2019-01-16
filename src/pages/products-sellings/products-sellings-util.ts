import { Injectable } from '@angular/core';
import { AlertController } from 'ionic-angular';

import { SettingsCache } from '../../providers/settings-cache';

@Injectable()
export class ProductsSellingsUtil {

    constructor(public alertCtrl: AlertController, private settingsProvider: SettingsCache) { }

    getRemoveSellingAlert(productName: string) {
        let alert = this.alertCtrl.create({
            title: 'Borrando!',
            message: `Estas Seguro de borrar la venta del producto: ${productName}`,
            buttons: [
                {
                    text: 'Cancelar',
                }
            ]
        });

        alert.addInput({
            type: 'checkbox',
            label: 'Actualizar la cantidad',
            value: 'true',
            checked: true
        });

        return alert;
    }

    getPriceTypes(selectedProductCategory: string): any[] {
        let productCategory =
            this.settingsProvider
                .getProductCategories()
                .filter(category => category.name == selectedProductCategory)[0];

        return productCategory.priceTypes;
    }
}