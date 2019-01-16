import { Injectable } from '@angular/core';

/**
 * Notifications service helper. 
 */
@Injectable()
export class TunariMessages {  
  
  authenticating: string = `Autenticando GrafTunari`;

  connectedToInternet: string = `Ahora estas conectado!`;
  
  loadingSettings: string = `Cargando configuraciones basicas`;

  noInternetError: string = `No estas conectado a Internet!,
        por favor verifica tu conexion y vuelve a intentarlo`;

  invalidUser: string = `Tus usuario o tu passwords son incorrectos!`;

  notAdminUser: string = `Tu usuario no es administrador!`;

  errorWhenSavingProduct: string = `Hubo un error salvando el producto!`;

  noPriceConfigured: string = `No hay un precio configurado para este producto, actualizalo!`;
}