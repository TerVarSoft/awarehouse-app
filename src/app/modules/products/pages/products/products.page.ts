import { Component, NgZone, OnInit } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import 'rxjs/add/observable/from';
import "rxjs/add/operator/debounceTime";
import "rxjs/add/operator/distinctUntilChanged"
import "rxjs/add/operator/switchMap";


import { ProductUpdateComponent } from '../../components/product-update/product-update.component';

import { ConnectionService } from '../../../shared/providers/connection.service';
import { ProductsService } from '../../../shared/providers/products.service';
import { NotifierService } from '../../../shared/providers/notifier.service';
import { SettingsCacheService } from '../../../shared/providers/settings-cache.service';

import { Product } from '../../../shared/models/product';

@Component({
  selector: 'page-products',
  styleUrls: ['products.page.scss'],
  templateUrl: 'products.page.html'
})
export class ProductsPage {

  products: Product[] = [];

  searchQuery: string = '';

  productsAreLoading: boolean = false;

  page: number = 1;

  selectedCategory: any = {};

  selectedType: any = {};

  selectedPrice: any = {};

  productCategories: any[];

  productTypes: any[];

  productPrices: any[];

  constructor(
    private productsProvider: ProductsService,
    private settingsProvider: SettingsCacheService,
    private notifier: NotifierService,
    private connection: ConnectionService,
    private alertCtrl: AlertController,
    private modalCtrl: ModalController,
    private _ngZone: NgZone
  ) {}

  ionViewWillEnter() {
    this.setDefaultValues();
    this.searchProducts();
  }

  /** Main Page functions */

  async onSearch($event) {
    this.page = 1;
    this.searchProducts($event.target.value);
  }

  async pullNextProductsPage(eventInfiniteScroll) {

    if (this.page > 0 && this.connection.isConnected()) {
      this.page++;
      await this.searchProducts();
      eventInfiniteScroll.target.complete();

    } else {
      eventInfiniteScroll.target.complete();
    }
  }

  async createProduct() {
    const createProductModal = await this.modalCtrl.create({
      component: ProductUpdateComponent,
      componentProps: {
        productToUpdate: new Product(),
        selectedProductCategoryId: this.selectedCategory.id,
        selectedProductTypeId: this.selectedType.id,
      }
    });

    return await createProductModal.present();
  }

  removeProductFromList(productToRemove: Product) {
    this.products =
      this.products.filter(product => product.code !== productToRemove.code)
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
          text: 'Buscar',
          handler: async data => {
            this.selectedCategory = data

            this.selectedType = this.productTypes[0];
            this.productTypes = await this.settingsProvider.getProductTypesWithAll(this.selectedCategory.id);
            this.productPrices = await this.settingsProvider.getProductPrices(this.selectedCategory.id, this.selectedType.id);

            this.selectedPrice = this.productPrices.length > 0 ?
              this.productPrices[0] : {};

            this.page = 1;
            this.searchQuery = '';
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
          text: 'Buscar',
          handler: data => {
            this.selectedType = data
            this.page = 1;
            this.searchQuery = '';
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
            this.selectedPrice = data
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


  private async searchProducts(searchText?: string) {
    const query = {
      tags: searchText || this.searchQuery,
      categoryId: this.selectedCategory.id,
      typeId: this.selectedType.id
    };

    if (this.page === 1) {
      this.productsAreLoading = true;
    }

    const productsResponse = await this.productsProvider.get(query, this.page);

    this._ngZone.run(() => {
      if (this.page === 1) {
        this.products = productsResponse.items;
        this.productsAreLoading = false;
      } else {
        this.products.push(...productsResponse.items);
      }
    });

    console.log(`Finished pulling page ${this.page} of products`);
  }

}
