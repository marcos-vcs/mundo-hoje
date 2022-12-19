import { Component } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ModalController } from '@ionic/angular';
import { Item } from 'src/app/models/news';
import { FavoritesQuantityService } from 'src/app/services/favorites-quantity.service';

@Component({
  selector: 'app-news-detail',
  templateUrl: './news-detail.component.html',
  styleUrls: ['./news-detail.component.scss'],
})
export class NewsDetailComponent {
  data: Item;
  errorImage = '../../../assets/no-found.png';

  constructor(
    private modalCtrl: ModalController,
    private favoriteQuantityService: FavoritesQuantityService,
    public sanitizer: DomSanitizer
  ) {}

  cancel() {
    this.favoriteQuantityService.updateFavoriteQuantity();
    return this.modalCtrl.dismiss('cancel');
  }

  confirm() {
    return this.modalCtrl.dismiss('confirm');
  }
}
