import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Configuration } from 'src/app/models/configuration';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss'],
})
export class AboutComponent implements OnInit {

  configuration: Configuration;

  constructor(private modalCtrl: ModalController, private storage: StorageService) { }

  ngOnInit() {
    this.storage.init();
    this.loadConfiguration();
  }

  async loadConfiguration(){
    await this.storage.openStore();
    const configuration = await (
      await this.storage.getItem('configurations')
    ).toString();
    this.configuration = configuration ? JSON.parse(configuration) as Configuration : new Configuration();
  }

  cancel() {
    return this.modalCtrl.dismiss('cancel');
  }

}
