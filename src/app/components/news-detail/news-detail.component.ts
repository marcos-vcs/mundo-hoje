import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { SocialSharing } from '@awesome-cordova-plugins/social-sharing/ngx';
import { LoadingController, ModalController } from '@ionic/angular';
import { Configuration } from 'src/app/models/configuration';
import { Item } from 'src/app/models/news';
import { FavoritesQuantityService } from 'src/app/services/favorites-quantity.service';
import { StorageService } from 'src/app/services/storage.service';
import { ToastService } from '../tools/toast.service';

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
    private loadingCtrl: LoadingController,
    private toast: ToastService,
    private socialSharing: SocialSharing,
    private favoriteQuantityService: FavoritesQuantityService,
    public sanitizer: DomSanitizer
  ) {}

  async ngOnInit() {
    this.storage.init();
    this.loadConfiguration();
    this.data.save = await this.isFavorited(this.data);
  }

  async loadConfiguration(){
    await this.storage.openStore();
    const configuration = await (
      await this.storage.getItem('configurations')
    ).toString();
    this.configuration = configuration ? JSON.parse(configuration) as Configuration : new Configuration();
  }

  shareNews(item: Item) {
    this.socialSharing
      .share(null, null, null, item.link)
      .then(() => {
        this.toast.presentToast(
          'Notícia compartilhada com sucesso',
          'top',
          'success'
        );
      })
      .catch(() => {
        this.toast.presentToast(
          'Erro ao compartilhar notícia',
          'top',
          'danger'
        );
      });
  }

  async favorite(item: Item) {
    const loading = await this.loadingCtrl.create({
      message: 'Carregando, aguarde...',
      duration: 10000,
    });

    loading.present();

    this.data.save = !item.save;
    await this.storage.openStore();
        const favorites = await (
          await this.storage.getItem('favorites')
        ).toString();
    let itens: Item[] = favorites ? (JSON.parse(favorites) as Item[]) : [];

    if (!itens.find((i) => i.id === item.id)) {
      item.save = true;
      itens.push(item);
    } else {
      this.data.save = false;
      itens = itens.filter((data) => data.id !== item.id);
    }

    this.storage.openStore();
    this.storage.setItem('favorites', JSON.stringify(itens));

    if (this.data.save) {
      this.toast.presentToast(
        'Notícia adicionada aos itens favoritados.',
        'top',
        'success'
      );
    } else {
      this.toast.presentToast(
        'Notícia removida dos itens favoritados.',
        'top',
        'danger'
      );
    }
    this.favoriteQuantityService.updateFavoriteQuantity();
    loading.dismiss();
  }

  cancel() {
    this.favoriteQuantityService.updateFavoriteQuantity();
    return this.modalCtrl.dismiss('cancel');
  }

  confirm() {
    return this.modalCtrl.dismiss('confirm');
  }

  private async isFavorited(item: Item): Promise<boolean> {
    await this.storage.openStore();
    const favorites = await (
      await this.storage.getItem('favorites')
    ).toString();
    const itens: Item[] = favorites ? (JSON.parse(favorites) as Item[]) : [];
    return itens.find((i) => i.id === item.id) ? true : false;
  }

}
