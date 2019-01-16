import { Component } from '@angular/core';

import { ProductsPage } from '../products/products';

@Component({
  selector: 'products-tabs',
  templateUrl: 'products-tabs.html'
})
export class ProductsTabsPage {
  bookStoreParams: any = { productCategory: 'Libreria'};
  invitationsParams: any = { productCategory: 'Invitaciones'};
  
  tab1Root: any = ProductsPage;
  tab2Root: any = ProductsPage;

  tab1Title = "Invitaciones";
  tab2Title = "Libreria";
}
