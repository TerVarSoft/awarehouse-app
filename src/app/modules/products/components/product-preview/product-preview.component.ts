import { Component, OnInit, Input } from '@angular/core';
import { NavController, NavParams, ModalController } from '@ionic/angular';

import { ApiService } from './../../..//shared/providers/api.service';

import { Product } from './../../..//shared/models/product';

@Component({
    selector: 'product-preview',
    templateUrl: 'product-preview.component.html',
})
export class ProductPreviewComponent implements OnInit {

    url: String;

    @Input() product: Product;

    constructor(
        private modalCtrl: ModalController,
        public navParams: NavParams,
        public navCtrl: NavController,
        public api: ApiService) {
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