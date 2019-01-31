import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { SellingsPage } from './pages/sellings/sellings.page';

import { TransactionsService } from './../shared/providers/transactions.service';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        IonicModule,
        RouterModule.forChild([
            {
                path: '',
                component: SellingsPage
            }
        ])
    ],
    declarations: [
        SellingsPage
    ],
    providers: [TransactionsService],
    entryComponents: []
})
export class SellingsModule { }
