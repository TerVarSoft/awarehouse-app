import { cloneDeep, union } from 'lodash';
import { Component, OnInit } from '@angular/core';
import { Camera } from '@ionic-native/camera/ngx';
import { NavParams, AlertController, NavController, ModalController } from '@ionic/angular';

import { ProductsService } from './../../../shared/providers/products.service';
import { ProductsUtil } from './../../products.util';
import { NotifierService } from './../../../shared/providers/notifier.service';
import { SettingsCacheService } from './../../../shared/providers/settings-cache.service';
import { MessagesService } from './../../../shared/providers/messages.service';

import { Product, updateProductPatch } from './../../../shared/models/product';

@Component({
  selector: 'product-update',
  templateUrl: 'product-update.component.html',
  styleUrls: ['product-update.component.scss'],
  providers: [ProductsUtil]
})
export class ProductUpdateComponent implements OnInit {

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

  productLocations: any[];

  optionalProductPrices: any[];


  constructor(public navParams: NavParams,
    private alertCtrl: AlertController,
    public navCtrl: NavController,
    private modalCtrl: ModalController,
    public util: ProductsUtil,
    public productsProvider: ProductsService,
    public notifier: NotifierService,
    private settingsProvider: SettingsCacheService,
    private messages: MessagesService,
    private camera: Camera) {

    this.originalProduct = this.navParams.data.productToUpdate;
    this.product = cloneDeep(this.originalProduct);
  }

  ngOnInit() {
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
    this.initProductLocations();
  }

  async initProductPrices() {
    this.productPrices = await this.settingsProvider.getProductPrices(
      this.product.categoryId || '0',
      this.product.typeId || '0');

    this.optionalProductPrices = await this.settingsProvider.getOptionalProductPrices(
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

    const newOptionalPrices = this.optionalProductPrices
      .filter(optionalPrice => {
        const foundPriceId = this.product.optionalPriceIds.find(priceId => priceId === optionalPrice.id);
        
        return foundPriceId !== undefined;
      })
      .map(priceType => {
        const productPrice = this.product.prices.find(price => price.priceId === priceType.id);
        return {
          priceId: priceType.id,
          name: priceType.name,
          value: productPrice ? productPrice.value : 0
        }
      });    

    this.product.prices = [...newPrices, ...newOptionalPrices];
  }

  async initProductLocations() {
    this.productLocations = await this.settingsProvider.getProductLocations(
      this.product.categoryId || '0',
      this.product.typeId || '0');

    const newLocations = this.productLocations.map(locationType => {
      const productLocation = this.product.locations.find(location => location.locationId === locationType.id);
      return {
        locationId: locationType.id,
        name: locationType.name,
        value: productLocation ? productLocation.value : '',
        quantity: productLocation ? productLocation.quantity : 0
      }
    });   

    this.product.locations = newLocations;
  }

  getOptionalPriceName(priceId) {
    const foundPrice = this.optionalProductPrices.find(price => price.id === priceId);

    return foundPrice ? foundPrice.name : ''
  }

  async addOptionalPrice() {

    const optionalPriceInputs: any[] = (await this.optionalProductPrices)
      .filter(optionalPrice => this.product.optionalPriceIds.find(priceId => priceId === optionalPrice.id) === undefined)
      .map(optionalPrice => ({
        label: optionalPrice.name,
        value: optionalPrice.id,
        type: 'checkbox'
      }));

    let addOptionalPriceAlert = await this.alertCtrl.create({
      header: 'Elige precios opcional',
      message: this.product.code,
      inputs: optionalPriceInputs,
      buttons: [
        {
          text: 'Cancelar',
        },
        {
          text: 'Agregar',
          handler: data => {
            this.product.optionalPriceIds = union(this.product.optionalPriceIds, data);
            this.initProductPrices();
          }
        }
      ]
    });
    addOptionalPriceAlert.present();
  }

  removeOptionalPrice(priceIdToRemove) {
    this.product.optionalPriceIds = this.product.optionalPriceIds.filter(optionalPriceId => optionalPriceId !== priceIdToRemove);

    console.log(this.product.optionalPriceIds);
    this.initProductPrices();
  }

  async addTag() {
    let addTagAlert = await this.alertCtrl.create({
      header: 'Agregar Etiqueta',
      message: this.product.code,
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
    this.camera.getPicture({
      destinationType: this.camera.DestinationType.DATA_URL,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
    }).then((imageData) => {
      this.imagePreview = "data:image/jpeg;base64," + imageData;
      this.tmpImageData = imageData;
    }, (err) => {
      console.log(err);
    });
  }

  takePicture() {
    this.camera.getPicture({
      destinationType: this.camera.DestinationType.DATA_URL,
    }).then((imageData) => {
      this.imagePreview = "data:image/jpeg;base64," + imageData;
      this.tmpImageData = imageData;
    }, (err) => {
      console.log(err);
    });
  }

  async save() {
    let createProductLoader = await this.notifier.createLoader(`Guardando producto ${this.product.code}`);
    this.product.isImgUploading = true;
    this.productsProvider.save(this.product).subscribe((updatedProduct: any) => {
      updateProductPatch(this.originalProduct, updatedProduct);
      // this.updateFavoritesInBackground();

      this.productsProvider.updateProductImg(updatedProduct.id, this.tmpImageData)
        .subscribe((updatedProduct: any) => {
          console.log('updating after upload')
          updateProductPatch(this.originalProduct, updatedProduct);
          // this.updateFavoritesInBackground();
        });

      this.modalCtrl.dismiss({
        updatedProduct: updatedProduct
      });
      createProductLoader.dismiss();
    }, error => {
      this.modalCtrl.dismiss();
      createProductLoader.dismiss();
      this.notifier.createToast(this.messages.errorWhenSavingProduct);
    });
  }

  removeTag(tagToRemove: string) {
    this.product.tags = this.product.tags.filter(tag => tag !== tagToRemove);
  }

  // addWarehouseLocation() {
  //   this.addLocation("Deposito");
  // }

  // addStoreLocation() {
  //   this.addLocation("Tienda");
  // }

  // private async addLocation(type: string) {
  //   let addLocationAlert = await this.alertCtrl.create({
  //     header: 'Agregar Ubicacion',
  //     message: type,
  //     inputs: [
  //       {
  //         name: 'newLocation',
  //         placeholder: 'Nueva Ubicacion'
  //       },
  //     ],
  //     buttons: [
  //       {
  //         text: 'Cancelar',
  //       },
  //       {
  //         text: 'Agregar',
  //         handler: data => {
  //           this.product.locations.unshift({
  //             type: type,
  //             value: data.newLocation
  //           });
  //         }
  //       }
  //     ]
  //   });
  //   addLocationAlert.present();
  // }

  removeLocation(locationToRemove) {
    this.product.locations = this.product.locations.filter(location => location !== locationToRemove);
  }

  closePreview() {
    this.modalCtrl.dismiss();
  }
}