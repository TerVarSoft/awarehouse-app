import { cloneDeep } from 'lodash';
import { Component } from '@angular/core';
import { Camera } from 'ionic-native';
import { NavParams, AlertController, NavController } from 'ionic-angular';

import { Products } from '../../../providers/products';
import { ProductsUtil } from './../products-util';
import { TunariNotifier } from '../../../providers/tunari-notifier';
import { SettingsCache } from '../../../providers/settings-cache';
import { TunariMessages } from '../../../providers/tunari-messages';

import { Product, updateProductPatch } from '../../../models/product';

@Component({
  selector: 'product-update',
  templateUrl: 'product-update.html',
  providers: [ProductsUtil]
})
export class ProductUpdatePage {

  segment = 'general';

  imagePreview: string;

  tmpImageData: string;

  isInvitation: boolean;

  product: Product;

  originalProduct: Product;

  productCategories: any[];

  priceTypes: any[]

  productTypes: any[];

  productPrices: any[];


  constructor(public navParams: NavParams,
    private alertCtrl: AlertController,
    public navCtrl: NavController,
    public util: ProductsUtil,
    public productsProvider: Products,
    public notifier: TunariNotifier,
    private settingsProvider: SettingsCache,
    private messages: TunariMessages) {

    this.originalProduct = this.navParams.data.product;
    this.product = cloneDeep(this.navParams.data.product);

    this.initProperties();
  }

  public updateCategory() {
    this.productTypes = this.settingsProvider.getProductTypes(this.product.categoryId);
    this.product.typeId = '0';
    this.initProductPrices();
  }

  public updateType() {
    this.initProductPrices();
  }

  public initProperties() {
    this.productCategories = this.settingsProvider.getProductCategories();
    this.product.categoryId = this.product.categoryId ||
      this.navParams.data.selectedProductCategoryId ||
      '0';
    this.productTypes = this.settingsProvider.getProductTypes(this.product.categoryId);

    this.product.typeId = this.product.typeId ||
      this.navParams.data.selectedProductTypeId ||
      '0';

    this.product.tags = this.product.tags || [];
    this.product.locations = this.product.locations || [];

    this.initProductPrices();
  }

  initProductPrices() {
    this.productPrices = this.settingsProvider.getProductPrices(
      this.product.categoryId || '0',
      this.product.typeId || '0');

    const newPrices = this.productPrices.map(priceType => {
      const productPrice = this.product.prices.find(price => price.priceId === priceType.id);
      return {
        priceId: priceType.id,
        name: priceType.name,
        value: productPrice ? productPrice.value : 0
      }
    });

    this.product.prices = newPrices;
  }

  addTag() {
    let addTagAlert = this.alertCtrl.create({
      title: 'Agregar Etiqueta',
      message: this.product.name,
      inputs: [
        {
          name: 'newTag',
          placeholder: 'Nueva Etiqueta'
        },
      ],
      buttons: [
        {
          text: 'Cancelar',
        },
        {
          text: 'Agregar',
          handler: data => {
            this.product.tags.unshift(data.newTag);
          }
        }
      ]
    });
    addTagAlert.present();
  }

  pickPicture() {
    Camera.getPicture({
      destinationType: Camera.DestinationType.DATA_URL,
      sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
    }).then((imageData) => {
      this.imagePreview = "data:image/jpeg;base64," + imageData;
      this.tmpImageData = imageData;
    }, (err) => {
      console.log(err);
    });
  }

  takePicture() {
    Camera.getPicture({
      destinationType: Camera.DestinationType.DATA_URL,
    }).then((imageData) => {
      this.imagePreview = "data:image/jpeg;base64," + imageData;
      this.tmpImageData = imageData;
    }, (err) => {
      console.log(err);
    });
  }

  save() {
    let createProductLoader = this.notifier.createLoader(`Guardando producto ${this.product.name}`);
    this.product.isImgUploading = true;
    this.productsProvider.save(this.product).subscribe((updatedProduct: any) => {
      updateProductPatch(this.originalProduct, updatedProduct);
      this.updateFavoritesInBackground();

      this.productsProvider.updateProductImg(updatedProduct.id, this.tmpImageData)
        .subscribe((updatedProduct: any) => {
          console.log('updating after upload')
          updateProductPatch(this.originalProduct, updatedProduct);
          this.updateFavoritesInBackground();
        });

      this.navCtrl.pop(updatedProduct);
      createProductLoader.dismiss();
    }, error => {
      this.navCtrl.pop();
      createProductLoader.dismiss();
      this.notifier.createToast(this.messages.errorWhenSavingProduct);
    });
  }

  removeTag(tagToRemove: string) {
    this.product.tags = this.product.tags.filter(tag => tag !== tagToRemove);
  }

  addWarehouseLocation() {
    this.addLocation("Deposito");
  }

  addStoreLocation() {
    this.addLocation("Tienda");
  }

  private addLocation(type: string) {
    let addLocationAlert = this.alertCtrl.create({
      title: 'Agregar Ubicacion',
      message: type,
      inputs: [
        {
          name: 'newLocation',
          placeholder: 'Nueva Ubicacion'
        },
      ],
      buttons: [
        {
          text: 'Cancelar',
        },
        {
          text: 'Agregar',
          handler: data => {
            this.product.locations.unshift({
              type: type,
              value: data.newLocation
            });
          }
        }
      ]
    });
    addLocationAlert.present();
  }

  removeLocation(locationToRemove) {
    this.product.locations = this.product.locations.filter(location => location !== locationToRemove);
  }

  private updateFavoritesInBackground() {
    console.log("Updating product favorites in background");
    // Just update, no need to retrieve the favorites so sending ""
    // to this method
    this.productsProvider.loadFavoritesFromServer("")
      .subscribe();
  }
}