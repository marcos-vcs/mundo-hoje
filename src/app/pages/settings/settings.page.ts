import { Configuration } from './../../models/configuration';
import { Component, OnInit } from '@angular/core';
import { StorageService } from 'src/app/services/storage.service';
import { AlertController, LoadingController } from '@ionic/angular';
import { Item } from 'src/app/models/news';
import { ToastService } from 'src/app/components/tools/toast.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {
  configuration = new Configuration();
  itens: Item[];

  constructor(
    private alertController: AlertController,
    private loadingCtrl: LoadingController,
    private storage: StorageService,
    private toast: ToastService
  ) {}

  async ngOnInit() {
    await this.storage.openStore();
    const favorites = await (
      await this.storage.getItem('favorites')
    ).toString();
    this.itens = favorites ? (JSON.parse(favorites) as Item[]) : [];

    await this.storage.init();
    await this.loadConfiguration();
    this.onToggleColorTheme();
  }

  async ionViewWillLeave() {
    await this.ngOnInit();
  }
  async ionViewWillEnter() {
    await this.ngOnInit();
  }

  async loadConfiguration() {
    const loading = await this.loadingCtrl.create({
      message: 'Carregando configurações previamente salvas, aguarde...',
      duration: 10000,
    });
    loading.present();

    await this.storage.openStore();
    const configuration = await (
      await this.storage.getItem('configurations')
    ).toString();

    if (configuration.length > 3) {
      this.configuration = JSON.parse(configuration) as Configuration;
    } else {
      this.configuration.isDarkMode = true;
      this.storage.openStore();
      this.storage.setItem(
        'configurations',
        JSON.stringify(this.configuration)
      );
    }

    loading.dismiss();
  }

  async updateConfiguration() {
    const loading = await this.loadingCtrl.create({
      message: 'Salvando configurações locais, aguarde...',
      duration: 10000,
    });
    loading.present();

    await this.storage.openStore();
    this.storage.setItem('configurations', JSON.stringify(this.configuration));

    loading.dismiss();
  }

  onToggleColorTheme() {
    if (this.configuration.isDarkMode) {
      document.body.setAttribute('color-theme', 'dark');
    } else {
      document.body.setAttribute('color-theme', 'light');
    }
  }

  async deleteAllFavorites() {
    const alert = await this.alertController.create({
      subHeader: `Caso confirme todas as notícias serão excluídos, tem certeza que deseja prosseguir?`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Confirmar',
          role: 'confirm',
        },
      ],
    });
    await alert.present();
    const role = await alert.onDidDismiss();

    if (role.role === 'confirm') {
      this.storage.openStore();
      this.storage.removeItem('favorites');
      this.toast.presentToast(
        'Todas as notícias removidas com sucesso :)',
        'top',
        'success'
      );
      await this.storage.openStore();
      const favorites = await (
        await this.storage.getItem('favorites')
      ).toString();
      this.itens = favorites ? (JSON.parse(favorites) as Item[]) : [];
    }
  }
}
