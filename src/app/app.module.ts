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

import { ConnectionService } from './modules/shared/providers/connection.service';
import { LoginService } from './modules/shared/providers/login.service';
import { NotifierService } from './modules/shared/providers/notifier.service';
import { MessagesService } from './modules/shared/providers/messages.service';
import { ProductsService } from './modules/shared/providers/products.service';
import { SettingsService } from './modules/shared/providers/settings.service';
import { SettingsCacheService } from './modules/shared/providers/settings-cache.service';
import { ApiService } from './modules/shared/providers/api.service';
import { StorageService } from './modules/shared/providers/storage.service';

@NgModule({
  declarations: [
    AppComponent
  ],
  entryComponents: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    IonicStorageModule.forRoot()],
  providers: [
    SplashScreen,
    StatusBar,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    ConnectionService,
    ApiService,        
    StorageService,
    MessagesService,
    NotifierService,
    LoginService,
    ProductsService,
    SettingsService,
    SettingsCacheService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
