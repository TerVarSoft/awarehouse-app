import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { ProductsPage } from './products.page';

import { ProductImgComponent } from './product-img/product-img.component';
import { LoadingImgComponent } from './loading-img/loading-img.component';
import { ThumbnailImgComponent } from './thumbnail-img/thumbnail-img.component';
import {  SafeUrlPipe } from './../../pipes/safe-url.pipe';

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
        ProductImgComponent,
        LoadingImgComponent,
        ThumbnailImgComponent,
        SafeUrlPipe
    ]
})
export class ProductsPageModule { }
