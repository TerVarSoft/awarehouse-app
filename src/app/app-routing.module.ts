import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', loadChildren: './modules/login/login.module#LoginModule' },
  { path: 'products', loadChildren: './../pages/products/products.module#ProductsModule' },
  { path: 'sellings', loadChildren: './modules/sellings/sellings.module#SellingsModule' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
