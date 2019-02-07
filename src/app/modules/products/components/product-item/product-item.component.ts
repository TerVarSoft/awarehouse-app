
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ActionSheetController, Platform, AlertController, ModalController } from '@ionic/angular';


import { ProductDetailComponent } from '../../components/product-detail/product-detail.component';
import { ProductUpdateComponent } from '../../components/product-update/product-update.component';

import { ProductsUtil } from './../../products.util';
import { ProductsService } from '../../../shared/providers/products.service';
import { MessagesService } from '../../../shared/providers/messages.service';
import { NotifierService } from '../../../shared/providers/notifier.service';

import { Product } from 'src/app/modules/shared/models/product';

@Component({
    selector: 'product-item',
    templateUrl: 'product-item.component.html',
    providers: [ProductsUtil]
})
export class ProductItemComponent {

    @Input() product: Product;

    @Input() selectedPrice: any;

    @Output() onDelete: EventEmitter<any> = new EventEmitter();    

    constructor(private platform: Platform,
        private actionSheetCtrl: ActionSheetController,
        private productsProvider: ProductsService,
        private util: ProductsUtil,
        private alertCtrl: AlertController,
        private modalCtrl: ModalController,
        private messages: MessagesService,
        private notifier: NotifierService) { }

    async addPriceWhenNoPrice(event) {
        event.stopPropagation();

        const priceToUpdate = this.product.prices.find(price => price.priceId === this.selectedPrice.id);

        let alert = await this.alertCtrl.create({
            header: this.product.name,
            message: this.selectedPrice.name,
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
                }, {
                    text: 'Guardar',
                    handler: async data => {
                        let saveProductLoader = await this.notifier.createLoader(`Salvando ${this.product.name}`);
                        const selectedPrice = this.product.prices.find(price => price.priceId === this.selectedPrice.id)

                        if (selectedPrice) {
                            selectedPrice.value = data.price;
                        } else {
                            saveProductLoader.dismiss();
                            this.notifier.createToast(this.messages.errorWhenSavingProduct);
                        }

                        this.productsProvider.put(this.product).subscribe(() => {
                            saveProductLoader.dismiss();
                        }, error => {
                            saveProductLoader.dismiss();
                            this.notifier.createToast(this.messages.errorWhenSavingProduct);
                        });
                    }
                }
            ]
        });

        alert.present();
    }

    getSelectedProductPrice(product: Product) {
        const selectedPrice = this.product.prices.find(price => price.priceId === this.selectedPrice.id);

        if (selectedPrice) {
            return `${selectedPrice.name}: ${selectedPrice.value} Bs.`;
        }

        return "";
    }

    async setProductQuantity(event, product: Product) {
        event.stopPropagation();

        let alert = await this.alertCtrl.create({
            header: this.product.name,
            message: "Nueva Cantidad",
            inputs: [
                {
                    name: 'quantity',
                    type: 'number',
                    placeholder: 'Especifica la cantidad!',
                    value: "" + this.product.quantity
                },
            ],
            buttons: [
                {
                    text: 'Cancel'
                }, {
                    text: 'Guardar',
                    handler: async data => {
                        let saveProductLoader = await this.notifier.createLoader(`Salvando ${this.product.name}`);
                        this.product.quantity = data.quantity;
                        this.productsProvider.put(this.product).subscribe(() => {
                            saveProductLoader.dismiss();
                        });
                    }
                }
            ]
        });

        alert.present();
    }    

    async openProductOptions(event) {
        event.stopPropagation();

        let actionSheet: any = await this.actionSheetCtrl.create({
            header: this.product.name,
            cssClass: 'product-options',
            buttons: [
                {
                    text: 'Ver',
                    icon: !this.platform.is('ios') ? 'eye' : null,
                    handler: () => {
                        this.goToProductDetails();
                    }
                }, {
                    text: 'Editar',
                    icon: !this.platform.is('ios') ? 'create' : null,
                    handler: () => {
                        this.updateProduct();
                    }
                }, {
                    text: 'Eliminar',
                    icon: !this.platform.is('ios') ? 'trash' : null,
                    handler: () => {
                        this.removeProduct();
                    }
                }
            ]
        });

        actionSheet.present();
    }

    async goToProductDetails() {
        const createProductModal = await this.modalCtrl.create({
            component: ProductDetailComponent,
            componentProps: {
                product: this.product
            }
        });

        createProductModal.present();
    }

    async updateProduct() {
        const updateProductModal = await this.modalCtrl.create({
            component: ProductUpdateComponent,
            componentProps: {
                product: this.product
            }
        });

        updateProductModal.present();
    }


    /** Private functions */

    private async removeProduct() {

        let removeProductAlert = await this.alertCtrl.create({
            header: 'Borrando!',
            message: `Estas Seguro de borrar el producto ${this.product.name}`,
            buttons: [
                {
                    text: 'Cancelar',
                }, {
                    text: 'Borralo!',
                    handler: async () => {
                        let removeProductLoader =
                            await this.notifier.createLoader(`Borrando el Producto ${this.product.name}`);
                        this.productsProvider.remove(this.product).subscribe(() => {

                            this.onDelete.emit(this.product);
                            // this.products =
                            //     this.products.filter(product => product.name !== this.product.name)
                            removeProductLoader.dismiss();
                        });
                    }
                }
            ]
        });

        removeProductAlert.present();
    }
}