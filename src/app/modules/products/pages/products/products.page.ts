import { Component, NgZone, OnInit } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import 'rxjs/add/observable/from';
import "rxjs/add/operator/debounceTime";
import "rxjs/add/operator/distinctUntilChanged"
import "rxjs/add/operator/switchMap";

import { ProductUpdateComponent } from '../../components/product-update/product-update.component';

import { ConnectionService } from '../../../shared/providers/connection.service';
import { ProductsService } from '../../../shared/providers/products.service';

import { Product } from '../../../shared/models/product';
import { ProductConfigCacheService } from 'src/app/modules/shared/providers/product-config-cache.service';

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

  productConfigCache: any;

  productFilters: any[];

  productPrices: any[];

  constructor(
    private productsProvider: ProductsService,
    private configCacheService: ProductConfigCacheService,
    private connection: ConnectionService,
    private alertCtrl: AlertController,
    private modalCtrl: ModalController,
    private _ngZone: NgZone
  ) { }

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
        productConfigCache: this.productConfigCache,
        selectedProductCategoryId: this.selectedCategory.id,
        selectedProductTypeId: this.selectedType.id,
      }
    });

    await createProductModal.present();

    const { data } = await createProductModal.onDidDismiss();

    if (data && data.updatedProduct) {
      this.products.unshift(data.updatedProduct);
    }
  }

  removeProductFromList(productToRemove: Product) {
    this.products =
      this.products.filter(product => product.code !== productToRemove.code)
  }

  /** Product filter functions */

  async changeFilter(event) {
    event.stopPropagation();

    const categoryInputs: any[] = this.productFilters
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

            const categoryFromData = data;
            if (data.subFilters.length > 0) {
              const typeInputs: any[] = data.subFilters
                .map(type => ({
                  label: type.name,
                  value: type,
                  type: 'radio',
                  checked: this.selectedType.id === type.id
                }));


              let alert = await this.alertCtrl.create({
                header: 'Tipos',
                message: 'Selecciona un Tipo',
                inputs: typeInputs,
                buttons: [
                  {
                    text: 'Cancel'
                  },
                  {
                    text: 'Buscar',
                    handler: async data => {
                      this.filterProducts(categoryFromData, data);
                    }
                  }
                ]
              });

              alert.present();
            } else {
              this.filterProducts(categoryFromData);
            }
          }
        }
      ]
    });

    alert.present();
  }

  filterProducts(selectedCategory = { id: '' }, selectedType = { id: '' }) {
    this.page = 1;
    this.searchQuery = '';
    this.selectedCategory = selectedCategory;
    this.selectedType = selectedType;

    const categoryTypeId = this.selectedType.id
      ? `${this.selectedCategory.id}:${this.selectedType.id}`
      : this.selectedCategory.id

    this.productPrices = this.productConfigCache.productPricesByCategoryAndType[categoryTypeId];
    this.selectedPrice = this.productPrices.length > 0 ?
      this.productPrices[0] : {};

    this.searchProducts();
  }

  async changePrice(event) {
    event.stopPropagation();

    const priceInputs: any[] = this.productPrices
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
    this.productConfigCache = await this.configCacheService.get();

    this.productFilters = this.productConfigCache.productCategoryAndTypeFilters;
    this.selectedCategory = this.productFilters[0];
    this.selectedType = { id: '' };

    const categoryTypeId = this.selectedType.id
      ? `${this.selectedCategory.id}:${this.selectedType.id}`
      : this.selectedCategory.id

    this.productPrices = this.productConfigCache.productPricesByCategoryAndType[categoryTypeId];
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
