import { Component, OnInit } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { TunariApi } from '../../../providers/tunari-api';

import { Product } from '../../../models/product';

@Component({
    selector: 'product-preview',
    templateUrl: 'product-preview.html',
})
export class ProductPreviewPage implements OnInit {

    url: String;

    product: Product;

    constructor(public navParams: NavParams, public navCtrl: NavController, public api: TunariApi) {
        this.product = this.navParams.data.product;
    }

    ngOnInit() {
        this.url = this.product.thumbnailUrl;

        this.api
            .getImage(this.product.previewUrl)
            .subscribe(url => {
                this.url = url;
            });
    }

    closePreview(){
        this.navCtrl.pop();
    }
}