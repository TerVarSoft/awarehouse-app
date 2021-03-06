import { DomSanitizer } from '@angular/platform-browser';
import { Injectable } from '@angular/core';
import { Http, Headers, ResponseContentType, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Events } from '@ionic/angular';
import { fromPromise } from 'rxjs/observable/fromPromise';
import { _throw } from 'rxjs/observable/throw';
// import 'rxjs/add/observable/fromPromise';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/catch';
// import 'rxjs/add/observable/throw';

import { StorageService } from './storage.service';

/**
 * Api, generic REST api handler.
 */
@Injectable()
export class ApiService {

  baseUrl: string = 'https://tunari.herokuapp.com/api/';

  // baseUrl: string = 'http://localhost:5000/api/';

  authKey: string = 'authorization';

  headers: Headers;

  multipartHeaders: Headers;

  constructor(public http: Http, public storage: StorageService,
    public sanitizer: DomSanitizer, public events: Events) {
    this.headers = new Headers({ 'Content-Type': 'application/json' });
    this.multipartHeaders = new Headers({});
  }

  get(endpoint: string, requestOptions: RequestOptions = new RequestOptions()) {
    let url = this.baseUrl + endpoint;
    requestOptions.headers = new Headers(this.headers);

    return this.getApiToken().flatMap(token => {
      if (token) {
        requestOptions.headers.append(this.authKey, 'Bearer ' + token);
      }

      return this.http.get(url, requestOptions)
        .map(resp => resp.json().data).catch(this.catchErrors());
    });
  }

  async getPromise(endpoint: string, requestOptions: RequestOptions = new RequestOptions()) {
    let url = this.baseUrl + endpoint;
    requestOptions.headers = new Headers(this.headers);

    const token = await this.storage.getAuthtoken();

    if (token) {
      requestOptions.headers.append(this.authKey, 'Bearer ' + token);
    }

    return await this.http.get(url, requestOptions)
      .map(resp => resp.json().data)
      .catch(this.catchErrors())
      .toPromise();
  }

  async getByIdPromise(endpoint: string, id: string, requestOptions: RequestOptions = new RequestOptions()) {

    let url = this.baseUrl + endpoint + "/" + id;
    requestOptions.headers = new Headers(this.headers);

    const token = await this.storage.getAuthtoken();

    if (token) {
      requestOptions.headers.append(this.authKey, 'Bearer ' + token);
    }

    return await this.http.get(url, requestOptions)
      .map(resp => resp.json().data)
      .catch(this.catchErrors())
      .toPromise();
  }

  async postPromise(endpoint: string, body: any) {

    let url = this.baseUrl + endpoint;
    let requestOptions = new RequestOptions();
    requestOptions.headers = new Headers(this.headers);

    const token = await this.storage.getAuthtoken();


    if (token) {
      requestOptions.headers.append(this.authKey, 'Bearer ' + token);
    }

    return await this.http
      .post(url, body, requestOptions)
      .map(resp => resp.json().data)
      .catch(this.catchErrors())
      .toPromise();
  }

  post(endpoint: string, body: any) {
    let url = this.baseUrl + endpoint;
    let requestOptions = new RequestOptions();
    requestOptions.headers = new Headers(this.headers);

    return this.getApiToken().flatMap(token => {
      if (token) {
        requestOptions.headers.append(this.authKey, 'Bearer ' + token);
      }

      return this.http.post(url, body, requestOptions)
        .map(resp => resp.json().data).catch(this.catchErrors());
    });
  }

  postImage(endpoint: string, imageData: any) {
    let url = this.baseUrl + endpoint;
    let requestOptions = new RequestOptions();
    requestOptions.headers = new Headers(this.multipartHeaders);

    return this.getApiToken().flatMap(token => {
      if (token) {
        requestOptions.headers.append(this.authKey, 'Bearer ' + token);
      }

      let blob = new Blob();
      if (imageData) {
        const binary = this.fixBinary(atob(imageData));
        blob = new Blob([binary]);
      }


      let formData = new FormData();
      formData.append('file', blob);

      return this.http
        .post(url, formData, requestOptions)
        .map(resp => resp.json().data);
    });
  }

  put(endpoint: string, body: any) {
    let url = this.baseUrl + endpoint;
    let requestOptions = new RequestOptions();
    requestOptions.headers = new Headers(this.headers);

    return this.getApiToken().flatMap(token => {
      if (token) {
        requestOptions.headers.append(this.authKey, 'Bearer ' + token);
      }

      return this.http.put(url, body, requestOptions)
        .map(resp => resp.json().data);
    });
  }

  async putPromise(endpoint: string, body: any) {

    let url = this.baseUrl + endpoint;
    let requestOptions = new RequestOptions();
    requestOptions.headers = new Headers(this.headers);

    const token = await this.storage.getAuthtoken();


    if (token) {
      requestOptions.headers.append(this.authKey, 'Bearer ' + token);
    }

    return await this.http
      .put(url, body, requestOptions)
      .map(resp => resp.json().data)
      .catch(this.catchErrors())
      .toPromise();
  }

  remove(endpoint: string, requestOptions: RequestOptions = new RequestOptions()) {
    let url = this.baseUrl + endpoint;
    requestOptions.headers = new Headers(this.headers);

    return this.getApiToken().flatMap(token => {
      if (token) {
        requestOptions.headers.append(this.authKey, 'Bearer ' + token);
      }

      return this.http.delete(url, requestOptions)
        .map(resp => resp.json());
    });
  }

  getImage(productUrl: string) {
    let requestOptions = new RequestOptions({
      headers: new Headers(),
      responseType: ResponseContentType.Blob
    });

    if (!productUrl) {
      return _throw({ status: 404 });
    }

    return this.http.get(productUrl, requestOptions)
      .map(res => res.blob())
      .map(blob => URL.createObjectURL(blob));
  }

  private getApiToken(): Observable<Headers> {
    return fromPromise(this.storage.getAuthtoken());
  }

  private fixBinary(bin) {
    var length = bin.length;
    var buf = new ArrayBuffer(length);
    var arr = new Uint8Array(buf);
    for (var i = 0; i < length; i++) {
      arr[i] = bin.charCodeAt(i);
    }
    return buf;
  }

  private catchErrors() {

    return async (res: Response) => {
      if (!res.text) return;

      const body = JSON.parse(await res.text());

      if (res.status === 0) {
        console.log("You are not connected to internet");

        this.events.publish('connection:No');
        return _throw({ _body: JSON.stringify({ status: 0 }) });
      }

      if (body.status === 401 && (body.code === 0 || body.code === 2 || body.code === 4)
        || body.status === 403) {
        console.log("Invalid or expired token. Redirecting to login");

        this.events.publish('user:logout');
      }

      return _throw(res);
    };
  }

}