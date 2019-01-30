import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'home', loadChildren: './home/home.module#HomePageModule' },
  { path: 'login', loadChildren: './../pages/login/login.module#LoginPageModule' },
  { path: 'products', loadChildren: './../pages/products/products.module#ProductsPageModule' },
  { path: 'sellings', loadChildren: './../pages/products-sellings/products-sellings.module#ProductsSellingsPageModule' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
