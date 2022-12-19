import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ModalController } from '@ionic/angular';
import { Configuration } from 'src/app/models/configuration';
import { Item } from 'src/app/models/news';
import { FavoritesQuantityService } from 'src/app/services/favorites-quantity.service';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-news-detail',
  templateUrl: './news-detail.component.html',
  styleUrls: ['./news-detail.component.scss'],
})
export class NewsDetailComponent implements OnInit {
  configuration: Configuration;
  data: Item;
  errorImage = '../../../assets/no-found.png';

  constructor(
    private modalCtrl: ModalController,
    private storage: StorageService,
    private favoriteQuantityService: FavoritesQuantityService,
    public sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
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
    this.favoriteQuantityService.updateFavoriteQuantity();
    return this.modalCtrl.dismiss('cancel');
  }

  confirm() {
    return this.modalCtrl.dismiss('confirm');
  }
}
