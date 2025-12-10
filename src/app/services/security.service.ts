import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root'
})
export class SecurityService {
  private readonly SECRET_KEY = 'AguasMovilSeguro';

  constructor() { }

  decrypt(ciphertext: string): string {
    try {
      const cleanCiphertext = ciphertext.replace(/\s/g, ''); 

      const key = CryptoJS.enc.Utf8.parse(this.SECRET_KEY);
      
      const decrypted = CryptoJS.AES.decrypt(cleanCiphertext, key, {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7
      });

      return decrypted.toString(CryptoJS.enc.Utf8);
    } catch (error) {
      console.error('Error descifrando:', error);
      return '';
    }
  }
}