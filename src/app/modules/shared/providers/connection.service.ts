import { Injectable } from '@angular/core';
import { Network } from "@ionic-native/network";

declare var navigator: any;

/**
 * Connection helper. 
 */
@Injectable()
export class ConnectionService {  
  
  // constructor(public network: Network) {

  // }

  isConnected(): boolean {       
    return navigator.onLine;    
  }
}