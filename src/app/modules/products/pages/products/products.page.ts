import { Component, NgZone, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
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

  constructor(
    private productsProvider: ProductsService,

    private settingsProvider: SettingsCacheService,

    private notifier: NotifierService,

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

  removeProductFromList(productToRemove: Product) {
    this.products =
      this.products.filter(product => product.name !== productToRemove.name)
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
