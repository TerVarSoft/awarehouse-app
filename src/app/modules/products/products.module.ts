import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { ProductsPage } from './pages/products/products.page';

import { Camera } from '@ionic-native/camera/ngx';

import { ProductDetailComponent } from './components/product-detail/product-detail.component';
import { ProductUpdateComponent } from './components/product-update/product-update.component';
import { ProductImgComponent } from './components/product-img/product-img.component';
import { ProductPreviewComponent } from './components/product-preview/product-preview.component';
import { LoadingImgComponent } from './components/loading-img/loading-img.component';
import { ThumbnailImgComponent } from './components/thumbnail-img/thumbnail-img.component';
import {  SafeUrlPipe } from '../../../pipes/safe-url.pipe';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        IonicModule,
        RouterModule.forChild([
            {
                path: '',
                component: ProductsPage
            }
        ])
    ],
    declarations: [
        ProductsPage,
        ProductDetailComponent,
        ProductUpdateComponent,        
        ProductImgComponent,
        ProductPreviewComponent,
        LoadingImgComponent,
        ThumbnailImgComponent,
        SafeUrlPipe
    ],
    entryComponents: [
        ProductDetailComponent,
        ProductUpdateComponent,
        ProductPreviewComponent,
    ],
    providers: [Camera]
})
export class ProductsModule { }
