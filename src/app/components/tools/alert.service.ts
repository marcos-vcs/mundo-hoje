import { Injectable } from '@angular/core';
import { AlertController } from '@ionic/angular';

@Injectable({
  providedIn: 'root',
})
export class AlertService {
  //#region variables
  private handlerMessage = false;
  //#endregion

  constructor(private alertController: AlertController) {}

  //#region methods
  async presentAlert(title: string, description: string) {
    const alert = await this.alertController.create({
      header: 'Alert',
      subHeader: title,
      message: description,
      buttons: ['OK'],
    });

    await alert.present();
  }
  async presentConfirmAlert(title: string) {
    const alert = await this.alertController.create({
      header: title,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            this.handlerMessage = false;
          },
        },
        {
          text: 'OK',
          role: 'confirm',
          handler: () => {
            this.handlerMessage = true;
          },
        },
      ],
    });

    await alert.present();
    await alert.onDidDismiss();
    return this.handlerMessage;
  }
  //#endregion
}
