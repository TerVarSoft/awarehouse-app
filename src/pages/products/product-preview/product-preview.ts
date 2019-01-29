import { Component, OnInit, Input } from '@angular/core';
import { NavController, NavParams, ModalController } from '@ionic/angular';

import { TunariApi } from '../../../providers/tunari-api';

import { Product } from '../../../models/product';

@Component({
    selector: 'product-preview',
    templateUrl: 'product-preview.html',
})
export class ProductPreviewPage implements OnInit {

    url: String;

    @Input() product: Product;

    constructor(
        private modalCtrl: ModalController,
        public navParams: NavParams,
        public navCtrl: NavController,
        public api: TunariApi) {
    }

    ngOnInit() {
        this.url = this.product.thumbnailUrl;

        this.api
            .getImage(this.product.previewUrl)
            .subscribe(url => {
                this.url = url;
            });
    }

    closePreview() {
        this.modalCtrl.dismiss();
    }
}