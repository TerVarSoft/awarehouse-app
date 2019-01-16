import { Component, Input, OnInit } from '@angular/core';
import { NavController } from 'ionic-angular';

import { TunariApi } from '../../../providers/tunari-api';

@Component({
  selector: 'thumbnail-img',
  templateUrl: 'thumbnail-img.component.html'
})
export class ThumbnailImgComponent implements OnInit {

  @Input() thumbnailUrl: string;

  url: string;

  isLoading: boolean = true;

  constructor(public navCtrl: NavController, public api: TunariApi) { }

  ngOnInit() {

    this.api
      .getImage(this.thumbnailUrl)
      .subscribe(url => {
        this.url = url;
        this.isLoading = false;
      },
        error => {
          if (error.status === 0) {
            this.url = 'assets/img/errorLoading.gif';
            this.isLoading = false;
          } else if (error.status === 404) {
            this.url = 'assets/img/defaultProduct.png';
            this.isLoading = false;
          }
        });
  }
}