import { ProductPrice } from "./product-price";

/**
 * Product model.
 */
export class Product {

  id: string;

  name: string;

  categoryId: string;

  typeId: string;

  description: string;

  // imageData: string;

  prices: ProductPrice[] = [];

  buyingUnitPrice: number;

  locations: any[];

  isFavorite: boolean;

  publicPackagePrice: number;

  publicUnitPrice: number;

  clientPackagePrice: number;

  clientUnitPrice: number;

  thumbnailUrl: string;

  previewUrl: string;

  imageUrl: string;

  provider: string;

  quantityPerPackage: number;

  quantity: number;

  tags: string[];

  isImgUploading: boolean;
}

export const updateProductPatch = (original: Product, newData: Product) => {
  original.id = newData.id;
  original.name = newData.name;
  original.thumbnailUrl = newData.thumbnailUrl;
  original.previewUrl = newData.previewUrl;
  original.prices = newData.prices;
  original.quantity = newData.quantity;
  original.description = newData.description;
  original.isImgUploading = newData.isImgUploading;
}