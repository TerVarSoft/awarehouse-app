import { ProductPrice } from "./product-price";
import { ProductLocation } from "./product-location";
import { ProductQuantityAlarm } from "./product-quantity-alarm";

/**
 * Product model.
 */
export class Product {

  id: string;

  code: string;

  categoryId: string;

  typeId: string;

  description: string;

  // imageData: string;

  prices: ProductPrice[] = [];

  locations: ProductLocation[] = [];

  quantityAlarms: ProductQuantityAlarm[] = [];

  buyingUnitPrice: number;  

  isFavorite: boolean;

  publicPackagePrice: number;

  publicUnitPrice: number;

  clientPackagePrice: number;

  clientUnitPrice: number;

  thumbnailUrl: string;

  previewUrl: string;

  imageUrl: string;

  provider: string;

  barCode: string = '';

  quantity: number;

  tags: string[];

  isImgUploading: boolean;

  optionalPriceIds: string[] = [];
}

export const updateProductPatch = (original: Product, newData: Product) => {
  original.id = newData.id;
  original.code = newData.code;
  original.thumbnailUrl = newData.thumbnailUrl;
  original.previewUrl = newData.previewUrl;
  original.prices = newData.prices;
  original.locations = newData.locations;
  original.quantityAlarms = newData.quantityAlarms;
  original.quantity = newData.quantity;
  original.barCode = newData.barCode;
  original.description = newData.description;
  original.isImgUploading = newData.isImgUploading;
  original.tags = newData.tags;
}