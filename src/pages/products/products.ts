import { Component, ElementRef, Renderer } from '@angular/core';
import { FormControl } from '@angular/forms';
import { NavController, NavParams, ActionSheetController, Platform, Alert, FabContainer } from 'ionic-angular';
import { Keyboard } from '@ionic-native/keyboard';
import 'rxjs/add/observable/from';
import "rxjs/add/operator/debounceTime";
import "rxjs/add/operator/distinctUntilChanged"
import "rxjs/add/operator/switchMap";

import { ProductDetailPage } from './product-detail/product-detail';
import { ProductUpdatePage } from './product-update/product-update';

import { Connection } from '../../providers/connection';
import { Products } from '../../providers/products';
import { Sellings } from '../../providers/sellings';
import { ProductsUtil } from './products-util';
import { TunariMessages } from '../../providers/tunari-messages';
import { TunariNotifier } from '../../providers/tunari-notifier';

import { Product } from '../../models/product';
import { SettingsCache } from '../../providers/settings-cache';

@Component({
  selector: 'page-products',
  templateUrl: 'products.html',
  providers: [ProductsUtil]
})
export class ProductsPage {

  private products: Product[];

  private searchQuery: FormControl = new FormControl();

  private page: number = 0;

  private selectedCategory: any = this.settingsProvider.getProductCategoriesWithAll()[0];

  private selectedType: any = this.settingsProvider.getProductTypesWithAll('')[0];

  private selectedPrice: any = this.settingsProvider.getProductPrices('', '')[0];

  private productCategories: any[];

  private productTypes: any[];

  private productPrices: any[];

  constructor(public platform: Platform,
    public navCtrl: NavController,
    public actionSheetCtrl: ActionSheetController,
    public keyboard: Keyboard,
    public renderer: Renderer,
    private elRef: ElementRef,
    public productsProvider: Products,
    public sellingsProvider: Sellings,
    public settingsProvider: SettingsCache,
    public util: ProductsUtil,
    public notifier: TunariNotifier,
    public messages: TunariMessages,
    public connection: Connection,
    public params: NavParams) {

    this.setDefaultValues();
    this.setupKeyboard();
    this.initFavorites();
    this.initSearchQuery();
  }

  /** Main Page functions */

  public pullNextProductsPage(infiniteScroll) {

    if (this.page > 0 && this.connection.isConnected()) {
      this.page++;
      console.log('Pulling page ' + this.page + '...');
      const query = {
        tags: this.searchQuery.value,
        categoryId: this.selectedCategory.id,
        typeId: this.selectedType.id
      }

      this.productsProvider.get(query, this.page)
        .map(productsObject => productsObject.items)
        .subscribe(
          products => this.products.push(...products),
          null,
          () => {
            infiniteScroll.complete();
            console.log('Finished pulling page successfully');
          });
    } else {
      infiniteScroll.complete();
    }
  }

  onSearchClear(event) {
    this.blurSearchBar();
  }

  /** Main Fab button functions. */

  createProduct(fab: FabContainer) {
    fab.close();
    this.navCtrl.push(ProductUpdatePage, {
      product: new Product(),
      selectedProductCategoryId: this.selectedCategory.id,
      selectedProductTypeId: this.selectedType.id,
    });
  }

  /** Individual Products functions. */

  goToProductDetails(product: Product) {
    this.navCtrl.push(ProductDetailPage, {
      product: product
    });
  }

  addPriceWhenNoPrice(event, product: Product) {
    event.stopPropagation();

    let alert: Alert = this.util.getAddPriceAlert(product, this.selectedPrice);
    alert.addButton({
      text: 'Guardar',
      handler: data => {
        let saveProductLoader = this.notifier.createLoader(`Salvando ${product.name}`);
        const selectedPrice = product.prices.find(price => price.priceId === this.selectedPrice.id)

        if (selectedPrice) {
          selectedPrice.value = data.price;
        } else {
          saveProductLoader.dismiss();
          this.notifier.createToast(this.messages.errorWhenSavingProduct);
        }

        this.productsProvider.put(product).subscribe(() => {
          saveProductLoader.dismiss();

          if (product.isFavorite) {
            this.updateFavoritesInBackground();
          }
        }, error => {
          saveProductLoader.dismiss();
          this.notifier.createToast(this.messages.errorWhenSavingProduct);
        });
      }
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

  setProductQuantity(event, product: Product) {
    event.stopPropagation();

    let alert: Alert = this.util.getAddQuantityAlert(product);
    alert.addButton({
      text: 'Guardar',
      handler: data => {
        let saveProductLoader = this.notifier.createLoader(`Salvando ${product.name}`);
        product.quantity = data.quantity;
        this.productsProvider.put(product).subscribe(() => {
          saveProductLoader.dismiss();

          if (product.isFavorite) {
            this.updateFavoritesInBackground();
          }
        });
      }
    });

    alert.present();
  }

  createSelling(event, product: Product) {
    event.stopPropagation();

    let alert: Alert = this.util.getCreateSellingAlert(product, this.selectedPrice.id);
    alert.addButton({
      text: 'Guardar',
      handler: data => {
        let createSellingLoader = this.notifier.createLoader(`Salvando ${product.name}`);
        product.quantity = data.quantity;
        this.sellingsProvider.post({
          productId: product.id,
          quantity: data.quantity,
          priceId: this.selectedPrice.id
        }).subscribe(() => {
          createSellingLoader.dismiss();
        });
      }
    });

    alert.present();
  }

  // createSelling(event, product: Product) {
  //   event.stopPropagation();

  //   this.navCtrl.push(ProductSellingUpdatePage, {
  //     selling: {},
  //     product: product
  //   });
  // }

  openProductOptions(event, product) {
    event.stopPropagation();

    let actionSheet = this.actionSheetCtrl.create({
      title: product.name,
      cssClass: 'product-options',
      buttons: [
        {
          text: 'Ver',
          icon: !this.platform.is('ios') ? 'eye' : null,
          handler: () => {
            this.navCtrl.push(ProductDetailPage, {
              product: product
            });
          }
        }, {
          text: 'Editar',
          icon: !this.platform.is('ios') ? 'create' : null,
          handler: () => {
            this.navCtrl.push(ProductUpdatePage, {
              product: product,
              selectedProductCategoryId: this.selectedCategory.id,
              selectedProductTypeId: this.selectedType.id,
            });
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

  /** Product options functions */

  changeCategory(event) {
    event.stopPropagation();

    let alert: Alert = this.util.getProductCategoriesAlert(this.selectedCategory);
    alert.addButton({
      text: 'Guardar',
      handler: data => {
        console.log(data);
        this.selectedCategory = data

        this.selectedType = this.productTypes[0];
        this.productTypes = this.settingsProvider.getProductTypesWithAll(this.selectedCategory.id);
        this.productPrices = this.settingsProvider.getProductPrices(this.selectedCategory.id, this.selectedType.id);

        this.selectedPrice = this.productPrices.length > 0 ?
          this.productPrices[0] : {};

        if (this.selectedCategory.id === '') {
          this.initFavorites();
        } else {
          this.searchProducts();
        }

      }
    })

    alert.present();
  }

  changeType(event) {
    event.stopPropagation();

    let alert: Alert = this.util.getProductTypesAlert(this.selectedCategory, this.selectedType);
    alert.addButton({
      text: 'Guardar',
      handler: data => {
        console.log(data);
        this.selectedType = data
        this.searchProducts();
      }
    })

    alert.present();
  }

  changePrice(event) {
    event.stopPropagation();

    let alert: Alert = this.util.getProductPricesAlert(this.selectedCategory, this.selectedType, this.selectedPrice);
    alert.addButton({
      text: 'Guardar',
      handler: data => {
        console.log(data);
        this.selectedPrice = data
        this.searchProducts();
      }
    })

    alert.present();
  }

  /** Private functions */

  private setDefaultValues() {
    this.productCategories = this.settingsProvider.getProductCategoriesWithAll();
    this.productTypes = this.settingsProvider.getProductTypesWithAll('');
    this.productPrices = this.settingsProvider.getProductPrices('', '');
  }

  private setupKeyboard() {
    this.keyboard.onKeyboardHide().subscribe(() => {
      this.blurSearchBar();
    });
  }

  private blurSearchBar() {
    const searchInput = this.elRef.nativeElement.querySelector('.searchbar-input')
    this.renderer
      .invokeElementMethod(searchInput, 'blur');
  }

  private removeProduct(productToDelete) {
    let removeProductAlert: Alert = this.util.getRemoveProductAlert(productToDelete.name);

    removeProductAlert.addButton({
      text: 'Borralo!',
      handler: () => {
        let removeProductLoader =
          this.notifier.createLoader(`Borrando el Producto ${productToDelete.name}`);
        this.productsProvider.remove(productToDelete).subscribe(() => {
          this.products =
            this.products.filter(product => product.name !== productToDelete.name)
          this.updateFavoritesInBackground();
          removeProductLoader.dismiss();
        });
      }
    });

    removeProductAlert.present();
  }

  private initFavorites() {
    this.page = 0;
    this.productsProvider.getFavorites(this.params.data.productCategory)
      .then(cachedFavorites => {
        if (cachedFavorites && cachedFavorites.length > 0) {
          console.log("Favorites pulled from storage...");
          this.products = cachedFavorites;
          this.updateFavoritesInBackground();
        } else {
          console.log("Favorites pulled from the server...");
          let loader = this.notifier.createLoader("Cargando Novedades");
          this.productsProvider.loadFavoritesFromServer(this.params.data.productCategory)
            .map(productsObject => productsObject.items)
            .subscribe(products => {
              this.products = products
              loader.dismiss();
            });
        }
      });
  }

  private updateFavoritesInBackground() {
    // Update storage in background with server response.
    console.log("Updating product favorites in background");
    this.productsProvider.loadFavoritesFromServer(this.params.data.productCategory)
      .subscribe();
  }

  private initSearchQuery() {
    this.searchQuery.valueChanges
      .filter(query => query)
      .filter(query => this.connection.isConnected())
      .debounceTime(100)
      .distinctUntilChanged()
      .switchMap(query => this.productsProvider.get({
        tags: query,
        categoryId: this.selectedCategory.id,
        typeId: this.selectedType.id
      }))
      .map(productsObject => productsObject.items)
      .subscribe(products => {
        this.page = 1;
        this.products = products
      });

    this.searchQuery.valueChanges
      .filter(query => query)
      .filter(query => !this.connection.isConnected())
      .subscribe(() => this.notifier.createToast(this.messages.noInternetError));

    this.searchQuery.valueChanges
      .filter(query => !query)
      .subscribe(() => this.initFavorites());
  }

  private searchProducts = () => {
    const query = {
      tags: this.searchQuery.value,
      categoryId: this.selectedCategory.id,
      typeId: this.selectedType.id
    };

    console.log(query);

    this.productsProvider.get(query).subscribe(products => {
      this.page = 1;
      this.products = products.items;
    }, null,
      () => {
        console.log('Finished pulling page 1 of products');
      });
  }
}
