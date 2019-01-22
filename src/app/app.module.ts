import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { RouteReuseStrategy } from '@angular/router';
import { IonicStorageModule } from '@ionic/storage';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { ProductsPage } from '../pages/products/products.page';
// import { LoginPage } from '../pages/login/login.page';
import { ProductImgComponent } from '../pages/products/product-img/product-img.component';

import { Connection } from '../providers/connection';
import { Login } from '../providers/login';
import { TunariNotifier } from '../providers/tunari-notifier';
import { TunariMessages } from '../providers/tunari-messages';
import { Products } from '../providers/products';
import { Settings } from '../providers/settings';
import { Sellings } from '../providers/sellings';
import { SettingsCache } from '../providers/settings-cache';
import { TunariApi } from '../providers/tunari-api';
import { TunariStorage } from '../providers/tunari-storage';

@NgModule({
  declarations: [
    AppComponent,
    // ProductsPage,
    // LoginPage,
    ProductImgComponent
  ],
  entryComponents: [
    AppComponent,
    // ProductsPage,
    // LoginPage
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    IonicStorageModule.forRoot()],
  providers: [
    Connection,
    Login,
    Products,
    Settings,
    Sellings,
    SettingsCache,
    SplashScreen,
    StatusBar,
    TunariApi,
    TunariMessages,
    TunariNotifier,
    TunariStorage,
    StatusBar,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
