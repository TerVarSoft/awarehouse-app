
import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

@Component({
    selector: 'loading-img',
    templateUrl: 'loading-img.component.html'
})
export class LoadingImgComponent {

    url: string = 'assets/img/loading.gif';

    constructor(public navCtrl: NavController) { }
}