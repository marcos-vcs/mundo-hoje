import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  constructor(private toastController: ToastController) {}

  async presentToast(
    text: string,
    positionOnScreen: 'top' | 'middle' | 'bottom',
    toastColor:
      | 'danger'
      | 'success'
      | 'warning'
      | 'tertiary'
      | 'primary'
      | 'medium'
      | 'secondary'
      | 'dark'
      | 'light'
  ) {
    const toast = await this.toastController.create({
      message: text,
      duration: 1500,
      position: positionOnScreen,
      cssClass: 'toast',
      color: toastColor,
    });
    await toast.present();
  }
}
