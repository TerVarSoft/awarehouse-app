import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { NavController, NavParams, Alert } from 'ionic-angular';
import * as _ from "lodash";

import { TunariNotifier } from '../../../providers/tunari-notifier';
import { ProductsSellingsUtil } from './../products-sellings-util';
import { Products } from '../../../providers/products';
import { Sellings } from '../../../providers/sellings';

import { Selling } from '../../../models/selling';
import { Product } from '../../../models/product';

@Component({
    selector: 'product-selling-update',
    templateUrl: 'product-selling-update.html',
    providers: [ProductsSellingsUtil]
})
export class ProductSellingUpdatePage {

    private INVITATION_TYPE: string = 'Invitaciones';

    isInvitation: boolean;

    selling: Selling;

    product: Product;

    priceIdFromOptions: string;

    quantityForPrice: number;

    priceTypes: any[]

    private formPrice: FormControl = new FormControl();

    private formOtherPrice: FormControl = new FormControl();

    private formQuantity: FormControl = new FormControl();

    private formPercentage: FormControl = new FormControl();

    private formBuyingPrice: FormControl = new FormControl();

    private formQuantityForPrice: FormControl = new FormControl();

    constructor(public navCtrl: NavController,
        public navParams: NavParams,
        public util: ProductsSellingsUtil,
        public notifier: TunariNotifier,
        public productsProvider: Products,
        public sellingsProvider: Sellings,
    ) {
        this.selling = this.navParams.data.selling;
        this.product = this.navParams.data.product;
        this.priceTypes = this.product ?
            this.util.getPriceTypes(this.product.categoryId) : null;

        this.formPrice.valueChanges
            .subscribe(price => {
                if (price !== null) {
                    this.selling.price = price;
                    this.updateFinalDetails();
                }
            });

        this.formOtherPrice.valueChanges
            .subscribe(price => {
                if (price !== null) {
                    this.priceIdFromOptions = null;
                    this.selling.price = price;
                    this.updateFinalDetails();
                }
            });

        this.formQuantity.valueChanges
            .subscribe(quantity => {
                if (quantity !== null) {
                    this.selling.quantity = quantity;
                    this.updateFinalDetails();
                }
            });

        this.formPercentage.valueChanges
            .subscribe(percentage => {
                if (percentage !== null) {
                    this.selling.percentage = percentage;
                    this.updateFinalDetails();
                }
            });

        this.formQuantityForPrice.valueChanges
            .subscribe(quantityForPrice => {
                if (quantityForPrice !== null) {
                    this.selling.quantityForPrice = quantityForPrice;
                    this.updateFinalDetails();
                }
            });

        this.formBuyingPrice.valueChanges
            .subscribe(buyingPrice => {
                if (buyingPrice !== null) {
                    this.selling.buyingPrice = buyingPrice;
                    this.updateFinalDetails();
                }
            });

        this.initSelling();
    }

    initSelling() {
        this.isInvitation = this.product ? (this.product.categoryId == this.INVITATION_TYPE) : false;
        this.selling.productId = this.product ?
            this.product.id :
            this.selling.productId;
        this.formQuantity.setValue(this.selling.quantity ||
            this.isInvitation ? 25 : 1);
        this.selling.productName = this.product ?
            this.product.name :
            this.selling.productName;
        this.selling.price = this.product ?
            this.product.prices[0].value :
            this.selling.price;
        this.selling.quantityForPrice = this.selling.quantityForPrice || this.isInvitation ? 100 : 1;
        this.priceIdFromOptions = this.product ?
            this.product.prices[0].priceId :
            null;
        this.formBuyingPrice.setValue(this.product ?
            this.product.buyingUnitPrice :
            this.selling.buyingPrice);
        this.formPercentage.setValue(this.selling.percentage || 0);
    }

    updatePriceFromOptions() {
        if (this.priceIdFromOptions !== null) {
            this.formOtherPrice.setValue(null);
            this.selling.price = this.product.prices[this.priceIdFromOptions].value;
            this.updateFinalDetails();
        }
    }

    updateQuantityForPrice() {
        this.updateFinalDetails();
    }

    private updateFinalDetails() {
        this.updateTotal();
        this.updateRevenue();
    }

    private updateTotal() {
        this.selling.total = this.selling.quantity * this.selling.price / this.selling.quantityForPrice
            + (this.selling.quantity * this.selling.price) * this.selling.percentage / 100;
        this.selling.total = _.round(this.selling.total, 2);
    }

    private updateRevenue() {
        this.selling.revenue = this.selling.total - this.selling.quantity * this.selling.buyingPrice;
        this.selling.revenue = _.round(this.selling.revenue, 2);
    }

    save() {
        let updateSellingLoader =
            this.notifier.createLoader('Guardando la venta');

        this.sellingsProvider.save(this.selling).subscribe(() => {
            if (this.product && this.product.isFavorite && this.product.quantity) {
                this.product.quantity -= this.selling.quantity;
                this.product.quantity = this.product.quantity < 0 ? 0 : this.product.quantity;
            }

            this.updateFavoritesInBackground();
            updateSellingLoader.dismiss();
            this.navCtrl.pop();
        });
    }

    remove() {
        let removeSellingtAlert: Alert = this.util.getRemoveSellingAlert(this.selling.productName);

        removeSellingtAlert.addButton({
            text: 'Borralo!',
            handler: alertResults => {
                let removeSellingLoader =
                    this.notifier.createLoader('Borrando la venta');

                const shouldUpdateProductQuantity: boolean = alertResults.length > 0;
                this.sellingsProvider.remove(this.selling, shouldUpdateProductQuantity).subscribe(() => {
                    this.updateFavoritesInBackground();
                    removeSellingLoader.dismiss();
                    this.navCtrl.pop();
                });
            }
        });

        removeSellingtAlert.present();
    }

    private updateFavoritesInBackground() {
        console.log("Updating product favorites in background");
        // Just update, no need to retrieve the favorites so sending ""
        // to this method
        this.productsProvider.loadFavoritesFromServer("")
            .subscribe();
    }
}