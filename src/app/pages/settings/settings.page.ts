import { Configuration } from './../../models/configuration';
import { Component, OnInit } from '@angular/core';
import { StorageService } from 'src/app/services/storage.service';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {
  configuration = new Configuration();

  constructor(
    private loadingCtrl: LoadingController,
    private storage: StorageService
  ) {}

  async ngOnInit() {
    await this.storage.init();
    await this.loadConfiguration();
    this.onToggleColorTheme();
  }

  ionViewWillLeave(){
    this.loadConfiguration();
    this.onToggleColorTheme();
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
      console.log('atual configuration: ');
      console.log(configuration);
    } else {
      this.configuration.isDarkMode = true;
      this.storage.openStore();
      this.storage.setItem('configurations', JSON.stringify(this.configuration));

      console.log('not found configuration:');
      console.log(JSON.stringify(this.configuration));
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
    console.log(this.configuration);
    if (this.configuration.isDarkMode) {
      document.body.setAttribute('color-theme', 'dark');
    } else {
      document.body.setAttribute('color-theme', 'light');
    }
  }
}
