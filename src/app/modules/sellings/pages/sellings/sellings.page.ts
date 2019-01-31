import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';

import * as _ from "lodash";
import * as moment from 'moment';

import { TransactionsService } from './../../../shared/providers/transactions.service';

import { Selling } from './../../../shared/models/selling';

@Component({
    selector: 'sellings',
    templateUrl: 'sellings.page.html'
})
export class SellingsPage {
    private sellings: Selling[];

    private groupedSellings = [];

    filterDate: Date;

    constructor(public transactionsProvider: TransactionsService,
        public navCtrl: NavController) { }

    ionViewWillEnter() {
        this.transactionsProvider.get()
            .subscribe(transactionsObject => {
                console.log(transactionsObject)
                this.formatTransactions(transactionsObject);
            });
    }

    editSelling(selling: Selling) {
        // this.navCtrl.push(ProductSellingUpdatePage, {
        //     selling: selling
        // });
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
