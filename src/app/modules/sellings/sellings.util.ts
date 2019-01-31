import { Injectable } from '@angular/core';
import { AlertController } from '@ionic/angular';

import { SettingsCacheService } from './../shared/providers/settings-cache.service';

@Injectable()
export class ProductsSellingsUtil {

    constructor(public alertCtrl: AlertController, private settingsProvider: SettingsCacheService) { }

    async getRemoveSellingAlert(productName: string) {
        let alert = await this.alertCtrl.create({
            header: 'Borrando!',
            message: `Estas Seguro de borrar la venta del producto: ${productName}`,
            buttons: [
                {
                    text: 'Cancelar',
                }
            ]
        });

        alert.inputs.push({
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