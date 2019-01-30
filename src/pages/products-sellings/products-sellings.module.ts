import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { ProductsSellingsPage } from './products-sellings';

import { Transactions } from './../../providers/transactions';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        IonicModule,
        RouterModule.forChild([
            {
                path: '',
                component: ProductsSellingsPage
            }
        ])
    ],
    declarations: [
        ProductsSellingsPage
    ],
    providers: [Transactions],
    entryComponents: []
})
export class ProductsSellingsPageModule { }
