import { Component, NgZone, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActionSheetController, Platform, AlertController, ModalController } from '@ionic/angular';
import 'rxjs/add/observable/from';
import "rxjs/add/operator/debounceTime";
import "rxjs/add/operator/distinctUntilChanged"
import "rxjs/add/operator/switchMap";

import { ProductDetailComponent } from '../../components/product-detail/product-detail.component';
import { ProductUpdateComponent } from '../../components/product-update/product-update.component';

import { ConnectionService } from '../../../shared/providers/connection.service';
import { ProductsService } from '../../../shared/providers/products.service';
import { SellingsService } from '../../../shared/providers/sellings.service';
import { ProductsUtil } from './../../products.util';
import { MessagesService } from '../../../shared/providers/messages.service';
import { NotifierService } from '../../../shared/providers/notifier.service';

import { Product } from '../../../shared/models/product';
import { SettingsCacheService } from '../../../shared/providers/settings-cache.service';

@Component({
  selector: 'page-products',
  styleUrls: ['products.page.scss'],
  templateUrl: 'products.page.html',
  providers: [ProductsUtil]
})
export class ProductsPage implements OnInit {

  products: Product[] = [];
  
  searchQuery: FormControl = new FormControl();

  productsAreLoading: boolean = false;

  page: number = 0;

  selectedCategory: any = {};

  selectedType: any = {};

  selectedPrice: any = {};

  productCategories: any[];

  productTypes: any[];

  productPrices: any[];

  constructor(private platform: Platform,
    private actionSheetCtrl: ActionSheetController,
    private productsProvider: ProductsService,
    private sellingsProvider: SellingsService,
    private settingsProvider: SettingsCacheService,
    private util: ProductsUtil,
    private notifier: NotifierService,
    private messages: MessagesService,
    private connection: ConnectionService,
    private alertCtrl: AlertController,
    private modalCtrl: ModalController,
    private _ngZone: NgZone
  ) {
    this.setDefaultValues();
    this.initSearchQuery();
  }

  ngOnInit() {
    this.searchProducts();
  }

  /** Main Page functions */

  async pullNextProductsPage(eventInfiniteScroll) {

    if (this.page > 0 && this.connection.isConnected()) {
      this.page++;
      console.log('Pulling page ' + this.page + '...');

      const query = {
        tags: this.searchQuery.value,
        categoryId: this.selectedCategory.id,
        typeId: this.selectedType.id
      }

      const productsResponse = await this.productsProvider.get(query, this.page);

      this.products.push(...productsResponse.items);
      eventInfiniteScroll.target.complete();
      console.log('Finished pulling page successfully');

    } else {
      eventInfiniteScroll.target.complete();
    }
  }

  async createProduct() {
    const createProductModal = await this.modalCtrl.create({
      component: ProductUpdateComponent,
      componentProps: {
        product: new Product(),
        selectedProductCategoryId: this.selectedCategory.id,
        selectedProductTypeId: this.selectedType.id,
      }
    });

    createProductModal.present();
  }  

  /** Individual Products functions. */

  async updateProduct(product: Product) {
    const updateProductModal = await this.modalCtrl.create({
      component: ProductUpdateComponent,
      componentProps: {
        product: product
      }
    });

    updateProductModal.present();
  }

  async goToProductDetails(product: Product) {
    const createProductModal = await this.modalCtrl.create({
      component: ProductDetailComponent,
      componentProps: {
        product: product
      }
    });

    createProductModal.present();
  }

  async addPriceWhenNoPrice(event, product: Product) {
    event.stopPropagation();

    const priceToUpdate = product.prices.find(price => price.priceId === this.selectedPrice.id);

    let alert = await this.alertCtrl.create({
      header: product.name,
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
            let saveProductLoader = await this.notifier.createLoader(`Salvando ${product.name}`);
            const selectedPrice = product.prices.find(price => price.priceId === this.selectedPrice.id)

            if (selectedPrice) {
              selectedPrice.value = data.price;
            } else {
              saveProductLoader.dismiss();
              this.notifier.createToast(this.messages.errorWhenSavingProduct);
            }

            this.productsProvider.put(product).subscribe(() => {
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
    const selectedPrice = product.prices.find(price => price.priceId === this.selectedPrice.id);

    if (selectedPrice) {
      return `${selectedPrice.name}: ${selectedPrice.value} Bs.`;
    }

    return "";
  }

  async setProductQuantity(event, product: Product) {
    event.stopPropagation();

    let alert = await this.alertCtrl.create({
      header: product.name,
      message: "Nueva Cantidad",
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
        }, {
          text: 'Guardar',
          handler: async data => {
            let saveProductLoader = await this.notifier.createLoader(`Salvando ${product.name}`);
            product.quantity = data.quantity;
            this.productsProvider.put(product).subscribe(() => {
              saveProductLoader.dismiss();
            });
          }
        }
      ]
    });

    alert.present();
  }

  async createSelling(event, product: Product) {
    event.stopPropagation();

    const selectedPrice = product.prices.find(price => price.priceId === this.selectedPrice.id);
    let alert = await this.alertCtrl.create({
      header: `Venta ${product.name}`,
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
        }, {
          text: 'Guardar',
          handler: async data => {
            let createSellingLoader = await this.notifier.createLoader(`Salvando ${product.name}`);
            product.quantity = data.quantity;
            (await this.sellingsProvider.post({
              productId: product.id,
              quantity: data.quantity,
              priceId: this.selectedPrice.id
            })).subscribe(() => {
              createSellingLoader.dismiss();
            });
          }
        }
      ]
    });

    alert.present();
  }

  async openProductOptions(event, product) {
    event.stopPropagation();

    let actionSheet: any = await this.actionSheetCtrl.create({
      header: product.name,
      cssClass: 'product-options',
      buttons: [
        {
          text: 'Ver',
          icon: !this.platform.is('ios') ? 'eye' : null,
          handler: () => {
            this.goToProductDetails(product);
          }
        }, {
          text: 'Editar',
          icon: !this.platform.is('ios') ? 'create' : null,
          handler: () => {
            this.updateProduct(product);
          }
        }, {
          text: 'Eliminar',
          icon: !this.platform.is('ios') ? 'trash' : null,
          handler: () => {
            this.removeProduct(product);
          }
        }
      ]
    });

    actionSheet.present();
  }

  /** Product filter functions */

  async changeCategory(event) {
    event.stopPropagation();

    const categoryInputs: any[] = (await this.settingsProvider.getProductCategoriesWithAll())
      .map(category => ({
        label: category.name,
        value: category,
        type: 'radio',
        checked: this.selectedCategory.id === category.id
      }));

    let alert = await this.alertCtrl.create({
      header: 'Categorias',
      message: 'Selecciona una categoria',
      inputs: categoryInputs,
      buttons: [
        {
          text: 'Cancel'
        },
        {
          text: 'Guardar',
          handler: async data => {
            console.log(data);
            this.selectedCategory = data

            this.selectedType = this.productTypes[0];
            this.productTypes = await this.settingsProvider.getProductTypesWithAll(this.selectedCategory.id);
            this.productPrices = await this.settingsProvider.getProductPrices(this.selectedCategory.id, this.selectedType.id);

            this.selectedPrice = this.productPrices.length > 0 ?
              this.productPrices[0] : {};

            this.searchProducts();

          }
        }
      ]
    });

    alert.present();
  }

  async changeType(event) {
    event.stopPropagation();

    const typeInputs: any[] = (await this.settingsProvider.getProductTypesWithAll(this.selectedCategory.id))
      .map(type => ({
        label: type.name,
        value: type,
        type: 'radio',
        checked: this.selectedType.id === type.id
      }));

    let alert = await this.alertCtrl.create({
      header: 'Tipos',
      message: 'Selecciona un tipo',
      inputs: typeInputs,
      buttons: [
        {
          text: 'Cancel'
        }, {
          text: 'Guardar',
          handler: data => {
            console.log(data);
            this.selectedType = data
            this.searchProducts();
          }
        }
      ]
    });

    alert.present();
  }

  async changePrice(event) {
    event.stopPropagation();

    const priceInputs: any[] = (await this.settingsProvider.getProductPrices(this.selectedCategory.id, this.selectedType.id))
      .map(price => ({
        label: price.name,
        value: price,
        type: 'radio',
        checked: this.selectedPrice.id === price.id
      }));

    let alert = await this.alertCtrl.create({
      header: 'Tipos',
      message: 'Selecciona un tipo',
      inputs: priceInputs,
      buttons: [
        {
          text: 'Cancel'
        }, {
          text: 'Guardar',
          handler: data => {
            console.log(data);
            this.selectedPrice = data
            this.searchProducts();
          }
        }
      ]
    });

    alert.present();
  }

  /** Private functions */

  private async setDefaultValues() {
    this.productCategories = await this.settingsProvider.getProductCategoriesWithAll();
    this.selectedCategory = this.productCategories[0];
    this.productTypes = await this.settingsProvider.getProductTypesWithAll('');
    this.selectedType = this.productTypes[0];
    this.productPrices = await this.settingsProvider.getProductPrices('', '');
    this.selectedPrice = this.productPrices[0];
  }

  private async removeProduct(productToDelete) {

    let removeProductAlert = await this.alertCtrl.create({
      header: 'Borrando!',
      message: `Estas Seguro de borrar el producto ${productToDelete.name}`,
      buttons: [
        {
          text: 'Cancelar',
        }, {
          text: 'Borralo!',
          handler: async () => {
            let removeProductLoader =
              await this.notifier.createLoader(`Borrando el Producto ${productToDelete.name}`);
            this.productsProvider.remove(productToDelete).subscribe(() => {
              this.products =
                this.products.filter(product => product.name !== productToDelete.name)
              removeProductLoader.dismiss();
            });
          }
        }
      ]
    });

    removeProductAlert.present();
  }

  private initSearchQuery() {

    this.searchQuery.valueChanges
      .filter(query => query)
      .filter(query => this.connection.isConnected())
      .debounceTime(200)
      .distinctUntilChanged()
      .subscribe(query => {
        this.searchProducts();
      });
  }


  private async searchProducts() {
    const query = {
      tags: this.searchQuery.value,
      categoryId: this.selectedCategory.id,
      typeId: this.selectedType.id
    };

    console.log(query);

    this.productsAreLoading = true;
    const productsResponse = await this.productsProvider.get(query);

    this._ngZone.run(() => {
      this.productsAreLoading = false;
      this.page = 1;
      this.products = productsResponse.items;
    });

    console.log('Finished pulling page 1 of products');
  }
}
