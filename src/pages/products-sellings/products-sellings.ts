import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { ProductSellingUpdatePage } from './product-selling-update/product-selling-update';

import * as _ from "lodash";
import * as moment from 'moment';

import { Transactions } from '../../providers/transactions';

import { Selling } from '../../models/selling';

@Component({
    selector: 'products-sellings',
    templateUrl: 'products-sellings.html'
})
export class ProductsSellingsPage {
    private sellings: Selling[];

    private groupedSellings = [];

    filterDate: Date;

    constructor(public transactionsProvider: Transactions,
        public navCtrl: NavController) { }

    ionViewWillEnter() {
        this.transactionsProvider.get()
            .subscribe(transactionsObject => {
                console.log(transactionsObject)
                this.formatTransactions(transactionsObject);
            });
    }

    editSelling(selling: Selling) {
        this.navCtrl.push(ProductSellingUpdatePage, {
            selling: selling
        });
    }

    filterByDate() {
        if (this.filterDate) {
            this.transactionsProvider.getByDate(this.filterDate)
                .subscribe(sellingsObject => {
                    this.formatTransactions(sellingsObject);
                });
        } else {
            this.transactionsProvider.get()
                .subscribe(sellingsObject => {
                    this.formatTransactions(sellingsObject);
                });
        }

    }

    private formatTransactions(transactionsObject) {
        this.sellings = _.orderBy(transactionsObject.items, ['createdAt'], ['desc']);

        this.groupedSellings = _.each(this.sellings, selling => selling.time = moment(selling.createdAt).format('h:mm a'));
        this.groupedSellings = _.groupBy(this.groupedSellings, selling => moment(selling.createdAt).format('dddd, Do MMMM YYYY'))
        this.groupedSellings = _.map(this.groupedSellings, function (sellings, day) { return { day: day, sellings: sellings }; });
    }

    clearFilterDate() {
        this.filterDate = null;
    }
}
